'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { workoutsAPI } from '@/lib/api';
import { Workout, WorkoutPlan } from '@/types';
import { Plus } from 'lucide-react';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [workoutsData, plansData] = await Promise.all([
        workoutsAPI.getWorkouts(),
        workoutsAPI.getWorkoutPlans(),
      ]);
      setWorkouts(workoutsData.workouts || []);
      setWorkoutPlans(plansData.plans || []);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const workoutData = {
      name: formData.get('name') as string,
      duration: parseInt(formData.get('duration') as string),
      calories_burned: parseInt(formData.get('calories_burned') as string),
      type: formData.get('type') as string,
    };

    try {
      await workoutsAPI.createWorkout(workoutData);
      setShowAddWorkout(false);
      loadData();
    } catch (error) {
      console.error('Failed to create workout:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Workouts</h1>
            <button
              onClick={() => setShowAddWorkout(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Workout
            </button>
          </div>

          {showAddWorkout && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Add New Workout</h3>
                <form onSubmit={handleAddWorkout} className="space-y-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Workout name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="duration"
                    type="number"
                    placeholder="Duration (minutes)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="calories_burned"
                    type="number"
                    placeholder="Calories burned"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select type</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="hiit">HIIT</option>
                  </select>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddWorkout(false)}
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
                <h2 className="text-xl font-semibold mb-4">My Workouts</h2>
                <div className="space-y-3">
                  {workouts.map((workout) => (
                    <div key={workout.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{workout.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {workout.duration} minutes • {workout.type}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {workout.calories_burned} calories burned
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {workouts.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No workouts logged yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Workout Plans</h2>
                <div className="space-y-3">
                  {workoutPlans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">{plan.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {plan.duration_weeks} weeks
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {plan.sessions_per_week} sessions per week
                      </p>
                    </div>
                  ))}
                  {workoutPlans.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No workout plans available</p>
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
