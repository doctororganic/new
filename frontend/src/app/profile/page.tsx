'use client';

import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '../providers';
import { userAPI } from '@/lib/api';
import { User } from '@/types';

export default function ProfilePage() {
  const { user: authUser, setUser } = useAuth();
  const [user, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    height: '',
    goals: [] as string[],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await userAPI.getProfile();
      setUserData(profile);
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        age: profile.profile?.age?.toString() || '',
        weight: profile.profile?.weight?.toString() || '',
        height: profile.profile?.height?.toString() || '',
        goals: profile.profile?.goals || [],
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = await userAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        profile: {
          age: formData.age ? parseInt(formData.age) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          goals: formData.goals,
        },
      });
      setUserData(updatedProfile);
      setUser(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
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
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goals</label>
                    <div className="space-y-2">
                      {['weight_loss', 'muscle_gain', 'endurance', 'flexibility'].map((goal) => (
                        <label key={goal} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.goals.includes(goal)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({ ...formData, goals: [...formData.goals, goal] });
                              } else {
                                setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 capitalize">{goal.replace('_', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        loadProfile();
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="text-sm text-gray-900">{user?.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="text-sm text-gray-900">{user?.email}</dd>
                      </div>
                      {user?.profile && (
                        <>
                          {user.profile.age && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Age</dt>
                              <dd className="text-sm text-gray-900">{user.profile.age}</dd>
                            </div>
                          )}
                          {user.profile.weight && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Weight</dt>
                              <dd className="text-sm text-gray-900">{user.profile.weight} kg</dd>
                            </div>
                          )}
                          {user.profile.height && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Height</dt>
                              <dd className="text-sm text-gray-900">{user.profile.height} cm</dd>
                            </div>
                          )}
                          {user.profile.goals && user.profile.goals.length > 0 && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500">Goals</dt>
                              <dd className="text-sm text-gray-900">
                                {user.profile.goals.map(g => g.replace('_', ' ')).join(', ')}
                              </dd>
                            </div>
                          )}
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
