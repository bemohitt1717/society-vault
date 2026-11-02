import axios from 'axios';

const AUTH_TOKEN_KEY = 'societyvault_token';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? '/api/v1'
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) window.localStorage.removeItem(AUTH_TOKEN_KEY);
    return Promise.reject(error);
  },
);

export const setAuthToken = (token) => window.localStorage.setItem(AUTH_TOKEN_KEY, token);
export const clearAuthToken = () => window.localStorage.removeItem(AUTH_TOKEN_KEY);

export const getApiErrorMessage = (error) => {
  if (error.response?.data?.error?.message) return error.response.data.error.message;
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the API. Check the API URL, server status, and allowed client origin.';
  }
  if (error.code === 'ECONNABORTED') return 'The API request timed out. Please try again.';
  return error.message || 'The request could not be completed.';
};

export default api;
