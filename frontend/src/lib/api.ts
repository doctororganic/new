import axios from 'axios';

const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  : 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  refresh: async () => {
    const response = await apiClient.post('/api/v1/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/api/v1/users/profile');
    return response.data;
  },
  updateProfile: async (data: any) => {
    const response = await apiClient.put('/api/v1/users/profile', data);
    return response.data;
  },
};

// Meals API
export const mealsAPI = {
  getMeals: async () => {
    const response = await apiClient.get('/api/v1/meals');
    return response.data;
  },
  createMeal: async (data: any) => {
    const response = await apiClient.post('/api/v1/meals', data);
    return response.data;
  },
  getMealPlans: async () => {
    const response = await apiClient.get('/api/v1/meals/plans');
    return response.data;
  },
  createMealPlan: async (data: any) => {
    const response = await apiClient.post('/api/v1/meals/plans', data);
    return response.data;
  },
};

// Workouts API
export const workoutsAPI = {
  getWorkouts: async () => {
    const response = await apiClient.get('/api/v1/workouts');
    return response.data;
  },
  createWorkout: async (data: any) => {
    const response = await apiClient.post('/api/v1/workouts', data);
    return response.data;
  },
  getWorkoutPlans: async () => {
    const response = await apiClient.get('/api/v1/workouts/plans');
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getWeightProgress: async () => {
    const response = await apiClient.get('/api/v1/progress/weight');
    return response.data;
  },
  logWeight: async (data: { weight: number; date?: string }) => {
    const response = await apiClient.post('/api/v1/progress/weight', data);
    return response.data;
  },
  getMeasurements: async () => {
    const response = await apiClient.get('/api/v1/progress/measurements');
    return response.data;
  },
  logMeasurements: async (data: any) => {
    const response = await apiClient.post('/api/v1/progress/measurements', data);
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
  status: async () => {
    const response = await apiClient.get('/api/status');
    return response.data;
  },
};

export default apiClient;
