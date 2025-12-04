/**
 * API Response Validators
 * Ensures frontend receives expected data structures from backend
 */

import { Meal, Workout, WeightProgress, Measurements, User, MealPlan, WorkoutPlan } from '@/types';

export function validateUserResponse(data: any): data is User {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.email === 'string'
  );
}

export function validateMealResponse(data: any): data is Meal {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.calories === 'number' &&
    typeof data.protein === 'number' &&
    typeof data.carbs === 'number' &&
    typeof data.fat === 'number'
  );
}

export function validateMealsResponse(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.meals) &&
    (typeof data.total === 'number' || typeof data.total === 'undefined')
  );
}

export function validateMealPlanResponse(data: any): data is MealPlan {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.target_calories === 'number' &&
    typeof data.meals_per_day === 'number'
  );
}

export function validateWorkoutResponse(data: any): data is Workout {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.duration === 'number' &&
    typeof data.calories_burned === 'number' &&
    typeof data.type === 'string'
  );
}

export function validateWorkoutsResponse(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.workouts)
  );
}

export function validateWorkoutPlanResponse(data: any): data is WorkoutPlan {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.duration_weeks === 'number' &&
    typeof data.sessions_per_week === 'number'
  );
}

export function validateWeightProgressResponse(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.progress) &&
    data.progress.every((item: any) => 
      typeof item === 'object' &&
      typeof item.date === 'string' &&
      typeof item.weight === 'number'
    )
  );
}

export function validateMeasurementsResponse(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.measurements) &&
    data.measurements.every((item: any) => 
      typeof item === 'object' &&
      typeof item.date === 'string'
    )
  );
}

export function validateLoginResponse(data: any): boolean {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.token === 'string' &&
    typeof data.user === 'object'
  );
}
