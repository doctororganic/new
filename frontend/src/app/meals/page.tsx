'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { mealsAPI } from '@/lib/api';
import { Meal, MealPlan } from '@/types';
import { Plus } from 'lucide-react';

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mealsData, plansData] = await Promise.all([
        mealsAPI.getMeals(),
        mealsAPI.getMealPlans(),
      ]);
      setMeals(mealsData.meals || []);
      setMealPlans(plansData.plans || []);
    } catch (error) {
      console.error('Failed to load meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const mealData = {
      name: formData.get('name') as string,
      calories: parseInt(formData.get('calories') as string),
      protein: parseInt(formData.get('protein') as string),
      carbs: parseInt(formData.get('carbs') as string),
      fat: parseInt(formData.get('fat') as string),
    };

    try {
      await mealsAPI.createMeal(mealData);
      setShowAddMeal(false);
      loadData();
    } catch (error) {
      console.error('Failed to create meal:', error);
    }
  };

  const handleAddPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const planData = {
      name: formData.get('name') as string,
      target_calories: parseInt(formData.get('target_calories') as string),
      meals_per_day: parseInt(formData.get('meals_per_day') as string),
    };

    try {
      await mealsAPI.createMealPlan(planData);
      setShowAddPlan(false);
      loadData();
    } catch (error) {
      console.error('Failed to create meal plan:', error);
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Meals</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddMeal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </button>
              <button
                onClick={() => setShowAddPlan(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success-600 hover:bg-success-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </button>
            </div>
          </div>

          {showAddMeal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Add New Meal</h3>
                <form onSubmit={handleAddMeal} className="space-y-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Meal name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="calories"
                    type="number"
                    placeholder="Calories"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="protein"
                    type="number"
                    placeholder="Protein (g)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="carbs"
                    type="number"
                    placeholder="Carbs (g)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="fat"
                    type="number"
                    placeholder="Fat (g)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMeal(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddPlan && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Create Meal Plan</h3>
                <form onSubmit={handleAddPlan} className="space-y-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Plan name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="target_calories"
                    type="number"
                    placeholder="Target calories"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="meals_per_day"
                    type="number"
                    placeholder="Meals per day"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddPlan(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">My Meals</h2>
                <div className="space-y-3">
                  {meals.map((meal) => (
                    <div key={meal.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{meal.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {meal.calories} calories
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {meals.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No meals logged yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Meal Plans</h2>
                <div className="space-y-3">
                  {mealPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Target: {plan.target_calories} calories/day
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {plan.meals_per_day} meals per day
                      </p>
                    </div>
                  ))}
                  {mealPlans.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No meal plans created yet</p>
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
