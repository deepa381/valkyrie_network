import axios from 'axios';

// Normalize API base so calls append /api. If NEXT_PUBLIC_API_URL provided, ensure it ends with /api
const rawApi = process.env.NEXT_PUBLIC_API_URL || 'https://api.valkyrie.network';
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
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
