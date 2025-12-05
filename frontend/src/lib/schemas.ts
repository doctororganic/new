import { z } from 'zod'

export const HealthSchema = z.object({
  status: z.string(),
  service: z.string(),
  timestamp: z.string(),
})

export const ConditionsSchema = z.object({
  conditions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      type: z.enum(['disease', 'injury']),
    })
  ),
})

export const MealsSchema = z.object({
  meals: z.preprocess((val) => Array.isArray(val) ? val : [], z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })
  )),
  total: z.number(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

export const WorkoutsSchema = z.object({
  workouts: z.preprocess((val) => Array.isArray(val) ? val : [], z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      duration: z.number(),
      calories_burned: z.number(),
      type: z.string(),
    })
  )),
  total: z.number().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

export const MealItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
})

export const WorkoutItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  duration: z.number(),
  calories_burned: z.number(),
  type: z.string(),
})

export const ConditionItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['disease','injury']),
})
