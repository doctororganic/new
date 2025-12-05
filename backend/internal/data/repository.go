package data

import (
  "context"
  "database/sql"
  _ "github.com/jackc/pgx/v5/stdlib"
  "strings"
  "strconv"
)

type Repository interface {
  ListConditions(ctx context.Context) ([]Condition, error)
  CreateCondition(ctx context.Context, name, typ string) (int, error)
  GetCondition(ctx context.Context, id int) (Condition, error)
  UpdateCondition(ctx context.Context, id int, name, typ string) error
  StoreMeals(ctx context.Context, meals []Meal) error
  StoreWorkouts(ctx context.Context, workouts []Workout) error
  StoreProgress(ctx context.Context, progress []Progress) error
  ListMeals(ctx context.Context, limit, offset int, q string, minCal, maxCal int) ([]Meal, int, error)
  GetMeal(ctx context.Context, id int) (Meal, error)
  CreateMeal(ctx context.Context, m Meal) (int, error)
  UpdateMeal(ctx context.Context, id int, m Meal) error
  ListWorkouts(ctx context.Context, limit, offset int, typeFilter string) ([]Workout, int, error)
  GetWorkout(ctx context.Context, id int) (Workout, error)
  CreateWorkout(ctx context.Context, w Workout) (int, error)
  UpdateWorkout(ctx context.Context, id int, w Workout) error
  ListProgress(ctx context.Context, limit, offset int, dateFrom, dateTo string) ([]Progress, int, error)
}

type PGRepository struct { db *sql.DB }

func NewPGRepository(db *sql.DB) *PGRepository { return &PGRepository{db: db} }

func (r *PGRepository) ListConditions(ctx context.Context) ([]Condition, error) {
  rows, err := r.db.QueryContext(ctx, `SELECT id,name,type FROM conditions ORDER BY id`)
  if err != nil { return nil, err }
  defer rows.Close()
  out := []Condition{}
  for rows.Next() {
    var c Condition
    if err := rows.Scan(&c.ID, &c.Name, &c.Type); err != nil { return nil, err }
    out = append(out, c)
  }
  return out, rows.Err()
}

func (r *PGRepository) CreateCondition(ctx context.Context, name, typ string) (int, error) {
  var id int
  err := r.db.QueryRowContext(ctx, `INSERT INTO conditions(name,type) VALUES($1,$2) RETURNING id`, name, typ).Scan(&id)
  return id, err
}

func (r *PGRepository) GetCondition(ctx context.Context, id int) (Condition, error) {
  var c Condition
  err := r.db.QueryRowContext(ctx, `SELECT id,name,type FROM conditions WHERE id=$1`, id).Scan(&c.ID, &c.Name, &c.Type)
  return c, err
}

func (r *PGRepository) UpdateCondition(ctx context.Context, id int, name, typ string) error {
  _, err := r.db.ExecContext(ctx, `UPDATE conditions SET name=$1,type=$2 WHERE id=$3`, name, typ, id)
  return err
}

func (r *PGRepository) StoreMeals(ctx context.Context, meals []Meal) error {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return err }
  stmt, err := tx.PrepareContext(ctx, `INSERT INTO meals(name,calories,protein,carbs,fat) VALUES($1,$2,$3,$4,$5)`)
  if err != nil { tx.Rollback(); return err }
  defer stmt.Close()
  for _, m := range meals {
    if _, err := stmt.ExecContext(ctx, m.Name, m.Calories, m.Protein, m.Carbs, m.Fat); err != nil { tx.Rollback(); return err }
  }
  return tx.Commit()
}

func (r *PGRepository) StoreWorkouts(ctx context.Context, workouts []Workout) error {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return err }
  stmt, err := tx.PrepareContext(ctx, `INSERT INTO workouts(name,duration,calories_burned,type) VALUES($1,$2,$3,$4)`)
  if err != nil { tx.Rollback(); return err }
  defer stmt.Close()
  for _, w := range workouts {
    if _, err := stmt.ExecContext(ctx, w.Name, w.Duration, w.CaloriesBurned, w.Type); err != nil { tx.Rollback(); return err }
  }
  return tx.Commit()
}

func (r *PGRepository) StoreProgress(ctx context.Context, progress []Progress) error {
  tx, err := r.db.BeginTx(ctx, nil)
  if err != nil { return err }
  stmt, err := tx.PrepareContext(ctx, `INSERT INTO progress(date,weight) VALUES($1,$2)`)
  if err != nil { tx.Rollback(); return err }
  defer stmt.Close()
  for _, p := range progress {
    if _, err := stmt.ExecContext(ctx, p.Date, p.Weight); err != nil { tx.Rollback(); return err }
  }
  return tx.Commit()
}

func (r *PGRepository) ListMeals(ctx context.Context, limit, offset int, q string, minCal, maxCal int) ([]Meal, int, error) {
  where := "WHERE 1=1"
  args := []interface{}{}
  if q != "" {
    args = append(args, "%"+q+"%")
    where += " AND name ILIKE $" + strconv.Itoa(len(args))
  }
  if minCal >= 0 {
    args = append(args, minCal)
    where += " AND calories >= $" + strconv.Itoa(len(args))
  }
  if maxCal >= 0 {
    args = append(args, maxCal)
    where += " AND calories <= $" + strconv.Itoa(len(args))
  }
  var total int
  if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM meals "+where, args...).Scan(&total); err != nil {
    return nil, 0, err
  }
  args = append(args, limit, offset)
  rows, err := r.db.QueryContext(ctx, "SELECT id,name,calories,protein,carbs,fat FROM meals "+where+" ORDER BY id LIMIT $"+strconv.Itoa(len(args)-1)+" OFFSET $"+strconv.Itoa(len(args)), args...)
  if err != nil { return nil, 0, err }
  defer rows.Close()
  out := []Meal{}
  for rows.Next() {
    var m Meal
    if err := rows.Scan(&m.ID, &m.Name, &m.Calories, &m.Protein, &m.Carbs, &m.Fat); err != nil { return nil, 0, err }
    out = append(out, m)
  }
  return out, total, rows.Err()
}

func (r *PGRepository) GetMeal(ctx context.Context, id int) (Meal, error) {
  var m Meal
  err := r.db.QueryRowContext(ctx, `SELECT id,name,calories,protein,carbs,fat FROM meals WHERE id=$1`, id).Scan(&m.ID, &m.Name, &m.Calories, &m.Protein, &m.Carbs, &m.Fat)
  return m, err
}

func (r *PGRepository) CreateMeal(ctx context.Context, m Meal) (int, error) {
  var id int
  err := r.db.QueryRowContext(ctx, `INSERT INTO meals(name,calories,protein,carbs,fat) VALUES($1,$2,$3,$4,$5) RETURNING id`, m.Name, m.Calories, m.Protein, m.Carbs, m.Fat).Scan(&id)
  return id, err
}

func (r *PGRepository) UpdateMeal(ctx context.Context, id int, m Meal) error {
  _, err := r.db.ExecContext(ctx, `UPDATE meals SET name=$1,calories=$2,protein=$3,carbs=$4,fat=$5 WHERE id=$6`, m.Name, m.Calories, m.Protein, m.Carbs, m.Fat, id)
  return err
}

func (r *PGRepository) ListWorkouts(ctx context.Context, limit, offset int, typeFilter string) ([]Workout, int, error) {
  where := "WHERE 1=1"
  args := []interface{}{}
  if typeFilter != "" {
    args = append(args, typeFilter)
    where += " AND type = $" + strconv.Itoa(len(args))
  }
  var total int
  if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM workouts "+where, args...).Scan(&total); err != nil {
    return nil, 0, err
  }
  args = append(args, limit, offset)
  rows, err := r.db.QueryContext(ctx, "SELECT id,name,duration,calories_burned,type FROM workouts "+where+" ORDER BY id LIMIT $"+strconv.Itoa(len(args)-1)+" OFFSET $"+strconv.Itoa(len(args)), args...)
  if err != nil { return nil, 0, err }
  defer rows.Close()
  out := []Workout{}
  for rows.Next() {
    var w Workout
    if err := rows.Scan(&w.ID, &w.Name, &w.Duration, &w.CaloriesBurned, &w.Type); err != nil { return nil, 0, err }
    out = append(out, w)
  }
  return out, total, rows.Err()
}

func (r *PGRepository) GetWorkout(ctx context.Context, id int) (Workout, error) {
  var w Workout
  err := r.db.QueryRowContext(ctx, `SELECT id,name,duration,calories_burned,type FROM workouts WHERE id=$1`, id).Scan(&w.ID, &w.Name, &w.Duration, &w.CaloriesBurned, &w.Type)
  return w, err
}

func (r *PGRepository) CreateWorkout(ctx context.Context, w Workout) (int, error) {
  var id int
  err := r.db.QueryRowContext(ctx, `INSERT INTO workouts(name,duration,calories_burned,type) VALUES($1,$2,$3,$4) RETURNING id`, w.Name, w.Duration, w.CaloriesBurned, w.Type).Scan(&id)
  return id, err
}

func (r *PGRepository) UpdateWorkout(ctx context.Context, id int, w Workout) error {
  _, err := r.db.ExecContext(ctx, `UPDATE workouts SET name=$1,duration=$2,calories_burned=$3,type=$4 WHERE id=$5`, w.Name, w.Duration, w.CaloriesBurned, w.Type, id)
  return err
}

func (r *PGRepository) ListProgress(ctx context.Context, limit, offset int, dateFrom, dateTo string) ([]Progress, int, error) {
  where := "WHERE 1=1"
  args := []interface{}{}
  if dateFrom != "" {
    args = append(args, dateFrom)
    where += " AND date >= $" + itoa(len(args))
  }
  if dateTo != "" {
    args = append(args, dateTo)
    where += " AND date <= $" + itoa(len(args))
  }
  var total int
  if err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM progress "+where, args...).Scan(&total); err != nil {
    return nil, 0, err
  }
  args = append(args, limit, offset)
  rows, err := r.db.QueryContext(ctx, "SELECT id,date,weight FROM progress "+where+" ORDER BY date DESC LIMIT $"+strconv.Itoa(len(args)-1)+" OFFSET $"+strconv.Itoa(len(args)), args...)
  if err != nil { return nil, 0, err }
  defer rows.Close()
  out := []Progress{}
  for rows.Next() {
    var p Progress
    if err := rows.Scan(&p.ID, &p.Date, &p.Weight); err != nil { return nil, 0, err }
    out = append(out, p)
  }
  return out, total, rows.Err()
}

// use strconv for parameter placeholders
func itoa(n int) string { return strconv.Itoa(n) }

type MemoryRepository struct {
  conditions []Condition
  meals []Meal
  workouts []Workout
  progress []Progress
}

func NewMemoryRepository() *MemoryRepository { return &MemoryRepository{conditions: []Condition{}, meals: []Meal{}, workouts: []Workout{}, progress: []Progress{}} }

func (r *MemoryRepository) ListConditions(ctx context.Context) ([]Condition, error) { return r.conditions, nil }

func (r *MemoryRepository) CreateCondition(ctx context.Context, name, typ string) (int, error) {
  id := len(r.conditions) + 1
  r.conditions = append(r.conditions, Condition{ID: id, Name: name, Type: typ})
  return id, nil
}

func (r *MemoryRepository) GetCondition(ctx context.Context, id int) (Condition, error) {
  for _, c := range r.conditions { if c.ID == id { return c, nil } }
  return Condition{}, sql.ErrNoRows
}

func (r *MemoryRepository) UpdateCondition(ctx context.Context, id int, name, typ string) error {
  for i, c := range r.conditions { if c.ID == id { r.conditions[i].Name = name; r.conditions[i].Type = typ; return nil } }
  return sql.ErrNoRows
}

func (r *MemoryRepository) StoreMeals(ctx context.Context, meals []Meal) error { 
  for _, m := range meals { m.ID = len(r.meals)+1; r.meals = append(r.meals, m) }
  return nil 
}
func (r *MemoryRepository) StoreWorkouts(ctx context.Context, workouts []Workout) error {
  for _, w := range workouts { w.ID = len(r.workouts)+1; r.workouts = append(r.workouts, w) }
  return nil
}
func (r *MemoryRepository) StoreProgress(ctx context.Context, progress []Progress) error {
  for _, p := range progress { p.ID = len(r.progress)+1; r.progress = append(r.progress, p) }
  return nil
}

func (r *MemoryRepository) ListMeals(ctx context.Context, limit, offset int, q string, minCal, maxCal int) ([]Meal, int, error) {
  filtered := make([]Meal, 0, len(r.meals))
  for _, m := range r.meals {
    if q != "" && !containsFold(m.Name, q) { continue }
    if minCal >= 0 && m.Calories < minCal { continue }
    if maxCal >= 0 && m.Calories > maxCal { continue }
    filtered = append(filtered, m)
  }
  total := len(filtered)
  end := offset + limit
  if offset > total { return []Meal{}, total, nil }
  if end > total { end = total }
  return filtered[offset:end], total, nil
}

func (r *MemoryRepository) GetMeal(ctx context.Context, id int) (Meal, error) {
  for _, m := range r.meals { if m.ID == id { return m, nil } }
  return Meal{}, sql.ErrNoRows
}

func (r *MemoryRepository) CreateMeal(ctx context.Context, m Meal) (int, error) {
  m.ID = len(r.meals) + 1
  r.meals = append(r.meals, m)
  return m.ID, nil
}

func (r *MemoryRepository) UpdateMeal(ctx context.Context, id int, m Meal) error {
  for i := range r.meals { if r.meals[i].ID == id { m.ID = id; r.meals[i] = m; return nil } }
  return sql.ErrNoRows
}

func (r *MemoryRepository) ListWorkouts(ctx context.Context, limit, offset int, typeFilter string) ([]Workout, int, error) {
  filtered := make([]Workout, 0, len(r.workouts))
  for _, w := range r.workouts {
    if typeFilter != "" && w.Type != typeFilter { continue }
    filtered = append(filtered, w)
  }
  total := len(filtered)
  end := offset + limit
  if offset > total { return []Workout{}, total, nil }
  if end > total { end = total }
  return filtered[offset:end], total, nil
}

func (r *MemoryRepository) GetWorkout(ctx context.Context, id int) (Workout, error) {
  for _, w := range r.workouts { if w.ID == id { return w, nil } }
  return Workout{}, sql.ErrNoRows
}

func (r *MemoryRepository) CreateWorkout(ctx context.Context, w Workout) (int, error) {
  w.ID = len(r.workouts) + 1
  r.workouts = append(r.workouts, w)
  return w.ID, nil
}

func (r *MemoryRepository) UpdateWorkout(ctx context.Context, id int, w Workout) error {
  for i := range r.workouts { if r.workouts[i].ID == id { w.ID = id; r.workouts[i] = w; return nil } }
  return sql.ErrNoRows
}

func (r *MemoryRepository) ListProgress(ctx context.Context, limit, offset int, dateFrom, dateTo string) ([]Progress, int, error) {
  filtered := r.progress
  total := len(filtered)
  end := offset + limit
  if offset > total { return []Progress{}, total, nil }
  if end > total { end = total }
  return filtered[offset:end], total, nil
}

func containsFold(s, substr string) bool {
  ls := strings.ToLower(s)
  lq := strings.ToLower(substr)
  return strings.Contains(ls, lq)
}
