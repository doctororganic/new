'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { progressAPI } from '@/lib/api';
import { WeightProgress, Measurements } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';

export default function ProgressPage() {
  const [weightProgress, setWeightProgress] = useState<WeightProgress[]>([]);
  const [measurements, setMeasurements] = useState<Measurements[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [showAddMeasurements, setShowAddMeasurements] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [weightData, measurementsData] = await Promise.all([
        progressAPI.getWeightProgress(),
        progressAPI.getMeasurements(),
      ]);
      setWeightProgress(weightData.progress || []);
      setMeasurements(measurementsData.measurements || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const weightData = {
      weight: parseFloat(formData.get('weight') as string),
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
    };

    try {
      await progressAPI.logWeight(weightData);
      setShowAddWeight(false);
      loadData();
    } catch (error) {
      console.error('Failed to log weight:', error);
    }
  };

  const handleAddMeasurements = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const measurementsData = {
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      chest: formData.get('chest') ? parseFloat(formData.get('chest') as string) : undefined,
      waist: formData.get('waist') ? parseFloat(formData.get('waist') as string) : undefined,
      hips: formData.get('hips') ? parseFloat(formData.get('hips') as string) : undefined,
    };

    try {
      await progressAPI.logMeasurements(measurementsData);
      setShowAddMeasurements(false);
      loadData();
    } catch (error) {
      console.error('Failed to log measurements:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddWeight(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Weight
              </button>
              <button
                onClick={() => setShowAddMeasurements(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-success-600 hover:bg-success-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Measurements
              </button>
            </div>
          </div>

          {showAddWeight && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Log Weight</h3>
                <form onSubmit={handleAddWeight} className="space-y-4">
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    placeholder="Weight (kg)"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Log
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddWeight(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showAddMeasurements && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold mb-4">Log Measurements</h3>
                <form onSubmit={handleAddMeasurements} className="space-y-4">
                  <input
                    name="date"
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="chest"
                    type="number"
                    step="0.1"
                    placeholder="Chest (cm)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="waist"
                    type="number"
                    step="0.1"
                    placeholder="Waist (cm)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    name="hips"
                    type="number"
                    step="0.1"
                    placeholder="Hips (cm)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-success-600 text-white rounded-md hover:bg-success-700"
                    >
                      Log
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMeasurements(false)}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Weight Progress</h2>
                {weightProgress.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weightProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No weight data logged yet</p>
                )}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-4">Body Measurements</h2>
                {measurements.length > 0 ? (
                  <div className="space-y-3">
                    {measurements.map((measurement, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-900">{measurement.date}</p>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                          {measurement.chest && (
                            <div>
                              <p className="text-xs text-gray-500">Chest</p>
                              <p className="text-sm font-medium">{measurement.chest} cm</p>
                            </div>
                          )}
                          {measurement.waist && (
                            <div>
                              <p className="text-xs text-gray-500">Waist</p>
                              <p className="text-sm font-medium">{measurement.waist} cm</p>
                            </div>
                          )}
                          {measurement.hips && (
                            <div>
                              <p className="text-xs text-gray-500">Hips</p>
                              <p className="text-sm font-medium">{measurement.hips} cm</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No measurements logged yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
