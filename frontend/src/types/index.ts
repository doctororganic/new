export interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    age?: number;
    weight?: number;
    height?: number;
    goals?: string[];
  };
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  target_calories: number;
  meals_per_day: number;
}

export interface Workout {
  id: string;
  name: string;
  duration: number;
  calories_burned: number;
  type: string;
  date?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  duration_weeks: number;
  sessions_per_week: number;
}

export interface WeightProgress {
  date: string;
  weight: number;
}

export interface Measurements {
  date: string;
  chest?: number;
  waist?: number;
  hips?: number;
}
