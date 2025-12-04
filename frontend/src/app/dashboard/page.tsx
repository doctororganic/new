'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mealsAPI, workoutsAPI, progressAPI } from '@/lib/api';
import { Meal, Workout, WeightProgress } from '@/types';
import { UtensilsCrossed, Dumbbell, TrendingUp, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [weightProgress, setWeightProgress] = useState<WeightProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mealsData, workoutsData, progressData] = await Promise.all([
          mealsAPI.getMeals(),
          workoutsAPI.getWorkouts(),
          progressAPI.getWeightProgress(),
        ]);

        setMeals(mealsData.meals || []);
        setWorkouts(workoutsData.workouts || []);
        setWeightProgress(progressData.progress || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalWorkoutCalories = workouts.reduce((sum, w) => sum + w.calories_burned, 0);
  const latestWeight = weightProgress.length > 0 ? weightProgress[weightProgress.length - 1].weight : null;

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UtensilsCrossed className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Calories</dt>
                      <dd className="text-lg font-medium text-gray-900">{totalCalories}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-6 w-6 text-success-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Protein</dt>
                      <dd className="text-lg font-medium text-gray-900">{totalProtein}g</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Dumbbell className="h-6 w-6 text-warning-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Workout Calories</dt>
                      <dd className="text-lg font-medium text-gray-900">{totalWorkoutCalories}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-error-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Current Weight</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {latestWeight ? `${latestWeight} kg` : 'N/A'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Meals</h3>
                <div className="space-y-3">
                  {meals.slice(0, 5).map((meal) => (
                    <div key={meal.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{meal.name}</p>
                        <p className="text-xs text-gray-500">
                          P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{meal.calories} cal</p>
                    </div>
                  ))}
                  {meals.length === 0 && (
                    <p className="text-sm text-gray-500">No meals logged yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Workouts</h3>
                <div className="space-y-3">
                  {workouts.slice(0, 5).map((workout) => (
                    <div key={workout.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{workout.name}</p>
                        <p className="text-xs text-gray-500">
                          {workout.duration} min • {workout.type}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{workout.calories_burned} cal</p>
                    </div>
                  ))}
                  {workouts.length === 0 && (
                    <p className="text-sm text-gray-500">No workouts logged yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
