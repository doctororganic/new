/**
 * API Integration Test Utility
 * Run this to verify backend connectivity and endpoint responses
 */

import { 
  healthAPI, 
  authAPI, 
  userAPI, 
  mealsAPI, 
  workoutsAPI, 
  progressAPI 
} from './api';

export interface TestResult {
  endpoint: string;
  status: 'pass' | 'fail';
  message: string;
  data?: any;
  error?: any;
}

export async function testBackendIntegration(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 1: Health Check
  try {
    const health = await healthAPI.check();
    results.push({
      endpoint: 'GET /health',
      status: health.status === 'healthy' ? 'pass' : 'fail',
      message: `Health check: ${health.status}`,
      data: health,
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /health',
      status: 'fail',
      message: 'Health check failed',
      error: error.message,
    });
  }

  // Test 2: API Status
  try {
    const status = await healthAPI.status();
    results.push({
      endpoint: 'GET /api/status',
      status: status.status === 'online' ? 'pass' : 'fail',
      message: `API Status: ${status.status}`,
      data: status,
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/status',
      status: 'fail',
      message: 'API status check failed',
      error: error.message,
    });
  }

  // Test 3: Login (with mock credentials)
  try {
    const loginResponse = await authAPI.login({ 
      email: 'demo@example.com', 
      password: 'password' 
    });
    results.push({
      endpoint: 'POST /api/v1/auth/login',
      status: loginResponse.token ? 'pass' : 'fail',
      message: loginResponse.token ? 'Login successful' : 'Login failed - no token',
      data: { hasToken: !!loginResponse.token, hasUser: !!loginResponse.user },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'POST /api/v1/auth/login',
      status: 'fail',
      message: 'Login failed',
      error: error.message,
    });
  }

  // Test 4: Get Profile (requires auth token)
  try {
    const profile = await userAPI.getProfile();
    results.push({
      endpoint: 'GET /api/v1/users/profile',
      status: profile.id ? 'pass' : 'fail',
      message: profile.id ? 'Profile retrieved successfully' : 'Profile missing required fields',
      data: { hasId: !!profile.id, hasEmail: !!profile.email },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/users/profile',
      status: 'fail',
      message: 'Profile fetch failed',
      error: error.message,
    });
  }

  // Test 5: Get Meals
  try {
    const meals = await mealsAPI.getMeals();
    results.push({
      endpoint: 'GET /api/v1/meals',
      status: Array.isArray(meals.meals) ? 'pass' : 'fail',
      message: `Meals retrieved: ${meals.meals?.length || 0} items`,
      data: { count: meals.meals?.length || 0 },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/meals',
      status: 'fail',
      message: 'Meals fetch failed',
      error: error.message,
    });
  }

  // Test 6: Get Meal Plans
  try {
    const plans = await mealsAPI.getMealPlans();
    results.push({
      endpoint: 'GET /api/v1/meals/plans',
      status: Array.isArray(plans.plans) ? 'pass' : 'fail',
      message: `Meal plans retrieved: ${plans.plans?.length || 0} items`,
      data: { count: plans.plans?.length || 0 },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/meals/plans',
      status: 'fail',
      message: 'Meal plans fetch failed',
      error: error.message,
    });
  }

  // Test 7: Get Workouts
  try {
    const workouts = await workoutsAPI.getWorkouts();
    results.push({
      endpoint: 'GET /api/v1/workouts',
      status: Array.isArray(workouts.workouts) ? 'pass' : 'fail',
      message: `Workouts retrieved: ${workouts.workouts?.length || 0} items`,
      data: { count: workouts.workouts?.length || 0 },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/workouts',
      status: 'fail',
      message: 'Workouts fetch failed',
      error: error.message,
    });
  }

  // Test 8: Get Workout Plans
  try {
    const plans = await workoutsAPI.getWorkoutPlans();
    results.push({
      endpoint: 'GET /api/v1/workouts/plans',
      status: Array.isArray(plans.plans) ? 'pass' : 'fail',
      message: `Workout plans retrieved: ${plans.plans?.length || 0} items`,
      data: { count: plans.plans?.length || 0 },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/workouts/plans',
      status: 'fail',
      message: 'Workout plans fetch failed',
      error: error.message,
    });
  }

  // Test 9: Get Weight Progress
  try {
    const progress = await progressAPI.getWeightProgress();
    results.push({
      endpoint: 'GET /api/v1/progress/weight',
      status: Array.isArray(progress.progress) ? 'pass' : 'fail',
      message: `Weight progress entries: ${progress.progress?.length || 0} items`,
      data: { count: progress.progress?.length || 0 },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/progress/weight',
      status: 'fail',
      message: 'Weight progress fetch failed',
      error: error.message,
    });
  }

  // Test 10: Get Measurements
  try {
    const measurements = await progressAPI.getMeasurements();
    results.push({
      endpoint: 'GET /api/v1/progress/measurements',
      status: Array.isArray(measurements.measurements) ? 'pass' : 'fail',
      message: `Measurements entries: ${measurements.measurements?.length || 0} items`,
      data: { count: measurements.measurements?.length || 0 },
    });
  } catch (error: any) {
    results.push({
      endpoint: 'GET /api/v1/progress/measurements',
      status: 'fail',
      message: 'Measurements fetch failed',
      error: error.message,
    });
  }

  return results;
}
