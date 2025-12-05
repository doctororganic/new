package main

import (
    "context"
    "database/sql"
    "encoding/json"
    "net/http"
    "os"
    "os/signal"
    "strconv"
    "strings"
    "syscall"
    "time"

    "github.com/go-playground/validator/v10"
    "github.com/redis/go-redis/v9"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    "golang.org/x/time/rate"

    "trae-nutrition-backend/internal/data"
)

type Config struct {
    Port        string
    Environment string
    DatabaseURL string
    RedisURL    string
    JWTSecret   string
    RateLimitRequests int
    RateLimitDuration time.Duration
    RateLimitBurst    int
    MaxFileSize       int64
    AllowedOrigins    []string
}

func main() {
    config := loadConfig()

    e := echo.New()
    e.HideBanner = true

    var repo data.Repository
    var rdb *redis.Client
    if config.DatabaseURL != "" {
        db, err := sql.Open("pgx", config.DatabaseURL)
        if err == nil {
            _ = db.Ping()
            repo = data.NewPGRepository(db)
        }
    }
    if repo == nil {
        repo = data.NewMemoryRepository()
    }
    if config.RedisURL != "" {
        opt, _ := redis.ParseURL(config.RedisURL)
        rdb = redis.NewClient(opt)
    }

    e.Use(middleware.Logger())
    e.Use(middleware.Recover())
    e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
        AllowOrigins: config.AllowedOrigins,
        AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete, http.MethodOptions},
        AllowHeaders: []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    }))
    e.Use(middleware.BodyLimit(strconv.FormatInt(config.MaxFileSize, 10)))
    e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(config.RateLimitRequests))))

    e.HTTPErrorHandler = func(err error, c echo.Context) {
        type resp struct {
            Error     string `json:"error"`
            Status    int    `json:"status"`
            Timestamp string `json:"timestamp"`
            Path      string `json:"path"`
        }
        code := http.StatusInternalServerError
        if he, ok := err.(*echo.HTTPError); ok {
            code = he.Code
        }
        _ = c.JSON(code, resp{
            Error:     err.Error(),
            Status:    code,
            Timestamp: time.Now().Format(time.RFC3339),
            Path:      c.Path(),
        })
    }
	e.Use(middleware.RateLimiter(middleware.NewRateLimiterMemoryStore(rate.Limit(100))))

	e.GET("/health", healthCheck)
	e.GET("/api/status", apiStatus)

    api := e.Group("/api/v1")
    setupRoutes(api, repo, rdb)

	go func() {
		if err := e.Start(":" + config.Port); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}
}

func loadConfig() Config {
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    maxFile := int64(10485760)
    if v := os.Getenv("MAX_FILE_SIZE"); v != "" {
        if n, err := strconv.ParseInt(v, 10, 64); err == nil {
            maxFile = n
        }
    }

    rlReq := 100
    if v := os.Getenv("RATE_LIMIT_REQUESTS"); v != "" {
        if n, err := strconv.Atoi(v); err == nil {
            rlReq = n
        }
    }
    rlBurst := 20
    if v := os.Getenv("RATE_LIMIT_BURST"); v != "" {
        if n, err := strconv.Atoi(v); err == nil {
            rlBurst = n
        }
    }
    rlDur := time.Minute
    if v := os.Getenv("RATE_LIMIT_DURATION"); v != "" {
        if d, err := time.ParseDuration(v); err == nil {
            rlDur = d
        }
    }

    origins := []string{"http://localhost:3000"}
    if v := os.Getenv("CORS_ALLOWED_ORIGINS"); v != "" {
        origins = strings.Split(v, ",")
    }

    return Config{
        Port:              port,
        Environment:       os.Getenv("ENVIRONMENT"),
        DatabaseURL:       os.Getenv("DATABASE_URL"),
        RedisURL:          os.Getenv("REDIS_URL"),
        JWTSecret:         os.Getenv("JWT_SECRET"),
        RateLimitRequests: rlReq,
        RateLimitDuration: rlDur,
        RateLimitBurst:    rlBurst,
        MaxFileSize:       maxFile,
        AllowedOrigins:    origins,
    }
}

func healthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"status":    "healthy",
		"service":   "trae-nutrition-backend",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func apiStatus(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"status":   "online",
		"version":  "1.0.0",
		"endpoints": []string{
			"/api/v1/health",
			"/api/v1/auth/*",
			"/api/v1/users/*",
			"/api/v1/meals/*",
			"/api/v1/workouts/*",
			"/api/v1/progress/*",
		},
	})
}

func setupRoutes(api *echo.Group, repo data.Repository, rdb *redis.Client) {
    api.GET("/health", healthCheck)

	// Auth routes
	auth := api.Group("/auth")
	auth.POST("/register", registerHandler)
	auth.POST("/login", loginHandler)
	auth.POST("/refresh", refreshHandler)

	// User routes
	users := api.Group("/users")
	users.GET("/profile", profileHandler)
	users.PUT("/profile", updateProfileHandler)

    // Meals routes
    meals := api.Group("/meals")
    meals.GET("", func(c echo.Context) error { return getMealsHandlerWithRepo(c, repo) })
    meals.GET("/:id", func(c echo.Context) error { return getMealByIDHandler(c, repo) })
    meals.POST("", func(c echo.Context) error { return createMealHandlerWithRepo(c, repo) })
    meals.PUT("/:id", func(c echo.Context) error { return updateMealHandlerWithRepo(c, repo) })
	meals.GET("/plans", getMealPlansHandler)
	meals.POST("/plans", createMealPlanHandler)

    // Workouts routes
    workouts := api.Group("/workouts")
    workouts.GET("", func(c echo.Context) error { return getWorkoutsHandlerWithRepo(c, repo) })
    workouts.GET("/:id", func(c echo.Context) error { return getWorkoutByIDHandler(c, repo) })
    workouts.POST("", func(c echo.Context) error { return createWorkoutHandlerWithRepo(c, repo) })
    workouts.PUT("/:id", func(c echo.Context) error { return updateWorkoutHandlerWithRepo(c, repo) })
	workouts.GET("/plans", getWorkoutPlansHandler)

	// Progress routes
    progress := api.Group("/progress")
    progress.GET("/weight", func(c echo.Context) error { return getWeightProgressHandlerWithRepo(c, repo) })
	progress.POST("/weight", logWeightHandler)
	progress.GET("/measurements", getMeasurementsHandler)
	progress.POST("/measurements", logMeasurementsHandler)

    // Health conditions & injuries routes
    conditions := api.Group("/conditions")
    conditions.GET("", func(c echo.Context) error { return getConditionsHandlerWithCache(c, repo, rdb) })
    conditions.POST("", func(c echo.Context) error { return createConditionHandlerWithCache(c, repo, rdb) })
    conditions.GET("/:id", func(c echo.Context) error { return getConditionByIDHandler(c, repo) })
    conditions.PUT("/:id", func(c echo.Context) error { return updateConditionHandlerWithCache(c, repo, rdb) })

    api.GET("/generate", func(c echo.Context) error { return generateDataHandlerWithRepo(c, repo) })
}

// Handler functions (simplified for deployment)
func registerHandler(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "User registered successfully",
		"status":  "success",
	})
}

func loginHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Login successful",
		"token":   "sample-jwt-token",
		"user": map[string]string{
			"id":    "1",
			"name":  "Demo User",
			"email": "demo@example.com",
		},
	})
}

func refreshHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"token": "new-sample-jwt-token",
	})
}

func profileHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"id":    "1",
		"name":  "Demo User",
		"email": "demo@example.com",
		"profile": map[string]interface{}{
			"age":    25,
			"weight": 70,
			"height": 175,
			"goals":  []string{"weight_loss", "muscle_gain"},
		},
	})
}

func updateProfileHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"message": "Profile updated successfully",
	})
}


func createMealHandler(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Meal created successfully",
		"id":      "2",
	})
}

func getMealPlansHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"plans": []map[string]interface{}{
			{
				"id":             "1",
				"name":           "Weight Loss Plan",
				"target_calories": 1800,
				"meals_per_day":   3,
			},
		},
	})
}

func createMealPlanHandler(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Meal plan created successfully",
		"id":      "2",
	})
}


func createWorkoutHandler(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Workout created successfully",
		"id":      "2",
	})
}

func getWorkoutPlansHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"plans": []map[string]interface{}{
			{
				"id":                "1",
				"name":              "Beginner Workout",
				"duration_weeks":    4,
				"sessions_per_week": 3,
			},
		},
	})
}


func logWeightHandler(c echo.Context) error {
	return c.JSON(http.StatusCreated, map[string]string{
		"message": "Weight logged successfully",
	})
}

func getMeasurementsHandler(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"measurements": []map[string]interface{}{
			{
				"date":  "2024-01-01",
				"chest": 100,
				"waist": 85,
				"hips":  95,
			},
		},
	})
}

func logMeasurementsHandler(c echo.Context) error {
    return c.JSON(http.StatusCreated, map[string]string{
        "message": "Measurements logged successfully",
    })
}

func getConditionsHandlerWithCache(c echo.Context, repo data.Repository, rdb *redis.Client) error {
    ctx := c.Request().Context()
    if rdb != nil {
        val, err := rdb.Get(ctx, "conditions:list").Result()
        if err == nil {
            var items []data.Condition
            if json.Unmarshal([]byte(val), &items) == nil {
                return c.JSON(http.StatusOK, map[string]interface{}{"conditions": items})
            }
        }
    }
    items, err := repo.ListConditions(ctx)
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to list conditions") }
    if rdb != nil {
        if b, err := json.Marshal(items); err == nil {
            _ = rdb.Set(ctx, "conditions:list", string(b), 60*time.Second).Err()
        }
    }
    return c.JSON(http.StatusOK, map[string]interface{}{"conditions": items})
}

var validate = validator.New()

type ConditionCreateDTO struct {
    Name string `json:"name" validate:"required,min=2"`
    Type string `json:"type" validate:"required,oneof=disease injury"`
}

func createConditionHandlerWithRepo(c echo.Context, repo data.Repository) error {
    var dto ConditionCreateDTO
    if err := c.Bind(&dto); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, "invalid payload")
    }
    if err := validate.Struct(dto); err != nil {
        return echo.NewHTTPError(http.StatusBadRequest, err.Error())
    }
    id, err := repo.CreateCondition(c.Request().Context(), dto.Name, dto.Type)
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to create condition") }
    return c.JSON(http.StatusCreated, map[string]interface{}{
        "message": "Condition created successfully",
        "id": id,
    })
}

func createConditionHandlerWithCache(c echo.Context, repo data.Repository, rdb *redis.Client) error {
    var dto ConditionCreateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    id, err := repo.CreateCondition(c.Request().Context(), dto.Name, dto.Type)
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to create condition") }
    if rdb != nil { _ = rdb.Del(c.Request().Context(), "conditions:list").Err() }
    return c.JSON(http.StatusCreated, map[string]interface{}{"message": "Condition created successfully", "id": id})
}

func generateDataHandlerWithRepo(c echo.Context, repo data.Repository) error {
    count := 10
    if v := c.QueryParam("count"); v != "" {
        if n, err := strconv.Atoi(v); err == nil && n > 0 && n <= 100 {
            count = n
        }
    }
    store := c.QueryParam("store") == "true"
    meals := make([]map[string]interface{}, 0, count)
    workouts := make([]map[string]interface{}, 0, count)
    progress := make([]map[string]interface{}, 0, count)
    dbMeals := make([]data.Meal, 0, count)
    dbWorkouts := make([]data.Workout, 0, count)
    dbProgress := make([]data.Progress, 0, count)
    for i := 1; i <= count; i++ {
        m := map[string]interface{}{
            "id":       strconv.Itoa(i),
            "name":     "Meal " + strconv.Itoa(i),
            "calories": 300 + i,
            "protein":  20 + i%10,
            "carbs":    40 + i%20,
            "fat":      10 + i%8,
        }
        meals = append(meals, m)
        dbMeals = append(dbMeals, data.Meal{Name: m["name"].(string), Calories: m["calories"].(int), Protein: m["protein"].(int), Carbs: m["carbs"].(int), Fat: m["fat"].(int)})
        w := map[string]interface{}{
            "id":              strconv.Itoa(i),
            "name":            "Workout " + strconv.Itoa(i),
            "duration":        20 + i%40,
            "calories_burned": 200 + i%150,
            "type":            "cardio",
        }
        workouts = append(workouts, w)
        dbWorkouts = append(dbWorkouts, data.Workout{Name: w["name"].(string), Duration: w["duration"].(int), CaloriesBurned: w["calories_burned"].(int), Type: w["type"].(string)})
        p := map[string]interface{}{
            "date":   time.Now().AddDate(0, 0, -i).Format("2006-01-02"),
            "weight": 75.0 - float64(i)*0.2,
        }
        progress = append(progress, p)
        dbProgress = append(dbProgress, data.Progress{Date: p["date"].(string), Weight: p["weight"].(float64)})
    }
    if store {
        _ = repo.StoreMeals(c.Request().Context(), dbMeals)
        _ = repo.StoreWorkouts(c.Request().Context(), dbWorkouts)
        _ = repo.StoreProgress(c.Request().Context(), dbProgress)
    }
    return c.JSON(http.StatusOK, map[string]interface{}{
        "meals":    meals,
        "workouts": workouts,
        "progress": progress,
        "count":    count,
    })
}
// repo-aware handlers
func getMealsHandlerWithRepo(c echo.Context, repo data.Repository) error {
    limitStr := c.QueryParam("limit")
    offsetStr := c.QueryParam("offset")
    q := c.QueryParam("q")
    minStr := c.QueryParam("min_calories")
    maxStr := c.QueryParam("max_calories")
    limit := 20
    offset := 0
    minCal := -1
    maxCal := -1
    if v, err := strconv.Atoi(limitStr); err == nil && v > 0 && v <= 100 { limit = v }
    if v, err := strconv.Atoi(offsetStr); err == nil && v >= 0 { offset = v }
    if v, err := strconv.Atoi(minStr); err == nil && v >= 0 { minCal = v }
    if v, err := strconv.Atoi(maxStr); err == nil && v >= 0 { maxCal = v }
    items, total, err := repo.ListMeals(c.Request().Context(), limit, offset, q, minCal, maxCal)
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to list meals") }
    if items == nil { items = []data.Meal{} }
    return c.JSON(http.StatusOK, map[string]interface{}{
        "meals": items,
        "total": total,
        "limit": limit,
        "offset": offset,
    })
}

func getWorkoutsHandlerWithRepo(c echo.Context, repo data.Repository) error {
    limitStr := c.QueryParam("limit")
    offsetStr := c.QueryParam("offset")
    typeFilter := c.QueryParam("type")
    limit := 20
    offset := 0
    if v, err := strconv.Atoi(limitStr); err == nil && v > 0 && v <= 100 { limit = v }
    if v, err := strconv.Atoi(offsetStr); err == nil && v >= 0 { offset = v }
    items, total, err := repo.ListWorkouts(c.Request().Context(), limit, offset, typeFilter)
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to list workouts") }
    if items == nil { items = []data.Workout{} }
    return c.JSON(http.StatusOK, map[string]interface{}{
        "workouts": items,
        "total": total,
        "limit": limit,
        "offset": offset,
    })
}

func getWeightProgressHandlerWithRepo(c echo.Context, repo data.Repository) error {
    limitStr := c.QueryParam("limit")
    offsetStr := c.QueryParam("offset")
    dateFrom := c.QueryParam("date_from")
    dateTo := c.QueryParam("date_to")
    limit := 20
    offset := 0
    if v, err := strconv.Atoi(limitStr); err == nil && v > 0 && v <= 100 { limit = v }
    if v, err := strconv.Atoi(offsetStr); err == nil && v >= 0 { offset = v }
    items, total, err := repo.ListProgress(c.Request().Context(), limit, offset, dateFrom, dateTo)
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to list progress") }
    if items == nil { items = []data.Progress{} }
    return c.JSON(http.StatusOK, map[string]interface{}{
        "progress": items,
        "total": total,
        "limit": limit,
        "offset": offset,
    })
}

func getConditionByIDHandler(c echo.Context, repo data.Repository) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    item, err := repo.GetCondition(c.Request().Context(), id)
    if err != nil { return echo.NewHTTPError(http.StatusNotFound, "not found") }
    return c.JSON(http.StatusOK, item)
}

type ConditionUpdateDTO struct {
    Name string `json:"name" validate:"required,min=2"`
    Type string `json:"type" validate:"required,oneof=disease injury"`
}

func updateConditionHandler(c echo.Context, repo data.Repository) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    var dto ConditionUpdateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    if err := repo.UpdateCondition(c.Request().Context(), id, dto.Name, dto.Type); err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to update condition") }
    return c.JSON(http.StatusOK, map[string]interface{}{"id": id, "message": "Condition updated"})
}

func updateConditionHandlerWithCache(c echo.Context, repo data.Repository, rdb *redis.Client) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    var dto ConditionUpdateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    if err := repo.UpdateCondition(c.Request().Context(), id, dto.Name, dto.Type); err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to update condition") }
    if rdb != nil { _ = rdb.Del(c.Request().Context(), "conditions:list").Err() }
    return c.JSON(http.StatusOK, map[string]interface{}{"id": id, "message": "Condition updated"})
}

type MealCreateDTO struct {
    Name string `json:"name" validate:"required,min=2"`
    Calories int `json:"calories" validate:"required,min=0"`
    Protein int `json:"protein" validate:"required,min=0"`
    Carbs int `json:"carbs" validate:"required,min=0"`
    Fat int `json:"fat" validate:"required,min=0"`
}

func createMealHandlerWithRepo(c echo.Context, repo data.Repository) error {
    var dto MealCreateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    id, err := repo.CreateMeal(c.Request().Context(), data.Meal{Name: dto.Name, Calories: dto.Calories, Protein: dto.Protein, Carbs: dto.Carbs, Fat: dto.Fat})
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to create meal") }
    return c.JSON(http.StatusCreated, map[string]interface{}{"id": id, "message": "Meal created"})
}

func getMealByIDHandler(c echo.Context, repo data.Repository) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    item, err := repo.GetMeal(c.Request().Context(), id)
    if err != nil { return echo.NewHTTPError(http.StatusNotFound, "not found") }
    return c.JSON(http.StatusOK, item)
}

type MealUpdateDTO = MealCreateDTO

func updateMealHandlerWithRepo(c echo.Context, repo data.Repository) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    var dto MealUpdateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    if err := repo.UpdateMeal(c.Request().Context(), id, data.Meal{Name: dto.Name, Calories: dto.Calories, Protein: dto.Protein, Carbs: dto.Carbs, Fat: dto.Fat}); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "failed to update meal")
    }
    return c.JSON(http.StatusOK, map[string]interface{}{"id": id, "message": "Meal updated"})
}

type WorkoutCreateDTO struct {
    Name string `json:"name" validate:"required,min=2"`
    Duration int `json:"duration" validate:"required,min=0"`
    CaloriesBurned int `json:"calories_burned" validate:"required,min=0"`
    Type string `json:"type" validate:"required"`
}

func createWorkoutHandlerWithRepo(c echo.Context, repo data.Repository) error {
    var dto WorkoutCreateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    id, err := repo.CreateWorkout(c.Request().Context(), data.Workout{Name: dto.Name, Duration: dto.Duration, CaloriesBurned: dto.CaloriesBurned, Type: dto.Type})
    if err != nil { return echo.NewHTTPError(http.StatusInternalServerError, "failed to create workout") }
    return c.JSON(http.StatusCreated, map[string]interface{}{"id": id, "message": "Workout created"})
}

func getWorkoutByIDHandler(c echo.Context, repo data.Repository) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    item, err := repo.GetWorkout(c.Request().Context(), id)
    if err != nil { return echo.NewHTTPError(http.StatusNotFound, "not found") }
    return c.JSON(http.StatusOK, item)
}

type WorkoutUpdateDTO = WorkoutCreateDTO

func updateWorkoutHandlerWithRepo(c echo.Context, repo data.Repository) error {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil || id <= 0 { return echo.NewHTTPError(http.StatusBadRequest, "invalid id") }
    var dto WorkoutUpdateDTO
    if err := c.Bind(&dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, "invalid payload") }
    if err := validate.Struct(dto); err != nil { return echo.NewHTTPError(http.StatusBadRequest, err.Error()) }
    if err := repo.UpdateWorkout(c.Request().Context(), id, data.Workout{Name: dto.Name, Duration: dto.Duration, CaloriesBurned: dto.CaloriesBurned, Type: dto.Type}); err != nil {
        return echo.NewHTTPError(http.StatusInternalServerError, "failed to update workout")
    }
    return c.JSON(http.StatusOK, map[string]interface{}{"id": id, "message": "Workout updated"})
}
