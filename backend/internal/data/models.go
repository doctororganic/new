package data

type Condition struct {
  ID int `json:"id"`
  Name string `json:"name"`
  Type string `json:"type"`
}

type Meal struct {
  ID int `json:"id"`
  Name string `json:"name"`
  Calories int `json:"calories"`
  Protein int `json:"protein"`
  Carbs int `json:"carbs"`
  Fat int `json:"fat"`
}

type Workout struct {
  ID int `json:"id"`
  Name string `json:"name"`
  Duration int `json:"duration"`
  CaloriesBurned int `json:"calories_burned"`
  Type string `json:"type"`
}

type Progress struct {
  ID int `json:"id"`
  Date string `json:"date"`
  Weight float64 `json:"weight"`
}
