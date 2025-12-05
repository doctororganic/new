CREATE TABLE IF NOT EXISTS conditions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('disease','injury')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein INTEGER NOT NULL,
  carbs INTEGER NOT NULL,
  fat INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meals_name ON meals (name);
CREATE INDEX IF NOT EXISTS idx_meals_calories ON meals (calories);

CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts (type);

CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_date ON progress (date);
