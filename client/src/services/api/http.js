import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const getApiErrorMessage = (error) => {
  if (error.response?.data?.error?.message) return error.response.data.error.message;
  if (error.code === 'ERR_NETWORK') {
    return 'Cannot reach the API. Check the API URL, server status, and allowed client origin.';
  }
  if (error.code === 'ECONNABORTED') return 'The API request timed out. Please try again.';
  return error.message || 'The request could not be completed.';
};

export default api;
