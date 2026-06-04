import axios from 'axios';

// Ensure the base URL always ends with /api so service calls like api.post('/auth...') resolve
const rawApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawApi.replace(/\/$/, '').endsWith('/api') ? rawApi.replace(/\/$/, '') : rawApi.replace(/\/$/, '') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to login if we actually have a 401 AND we're on a protected route
    // This prevents bouncing on login/signup endpoints which may legitimately return 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        // Don't redirect if already on auth pages
        if (!currentPath.startsWith('/auth/')) {
          localStorage.removeItem('auth-storage');
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export function getApiErrorMessage(error, fallbackMessage = 'Request failed') {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallbackMessage;
}
