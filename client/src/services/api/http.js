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
export const hasAuthToken = () => Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY));

export const logApiError = (error, context = 'API request failed') => {
  if (!import.meta.env.DEV) return;

  const isHttpError = Boolean(error?.isAxiosError || error?.config || error?.response);
  if (!isHttpError) {
    console.error(
      `[${context}] Client-side error: ${error?.name || 'Unknown error'}: ${error?.message || String(error)}`,
      error?.stack || '',
    );
    return;
  }

  const requestUrl = error?.config?.url;
  const responseError = error?.response?.data?.error;
  const validationIssues = Array.isArray(responseError?.details)
    ? responseError.details.map(({ path, message }) => ({ path, message }))
    : undefined;
  const url = requestUrl
    ? `${error.config.baseURL || ''}${requestUrl.split('?')[0]}`
    : 'Unknown URL';
  const status = error?.response?.status || 'No HTTP response';
  const code = error?.code || 'No network error code';

  console.error(
    `[${context}] ${error?.config?.method?.toUpperCase() || 'HTTP'} ${url} — ${status} (${code}): ${error?.message || 'Request failed'}`,
    {
      statusText: error?.response?.statusText,
      serverMessage: responseError?.message,
      validationIssues,
      stack: error?.stack,
    },
  );
};

export const getApiErrorMessage = (error, context = 'API request failed') => {
  logApiError(error, context);

  const firebaseMessages = {
    'auth/popup-closed-by-user': 'Google sign-in was cancelled. Try again when you’re ready.',
    'auth/cancelled-popup-request': 'A Google sign-in window is already open. Finish it or try again.',
    'auth/popup-blocked': 'Your browser blocked the Google sign-in window. Allow pop-ups and try again.',
    'auth/unauthorized-domain': 'Google sign-in is not enabled for this website yet. Contact your administrator.',
    'auth/network-request-failed': 'We couldn’t connect to Google. Check your connection and try again.',
  };
  if (firebaseMessages[error?.code]) return firebaseMessages[error.code];

  const safeMessages = new Set([
    'Administrator accounts can only be created by the system administrator.',
    'Administrator account details could not be loaded.',
    'The saved account session is invalid. Sign in again to continue.',
    'Your session has expired. Sign in again to continue.',
  ]);
  if (safeMessages.has(error?.message) || /^This account is registered as (Administrator|Resident)\.$/.test(error?.message || '')) {
    return error.message;
  }

  if (error?.code === 'ERR_NETWORK') {
    if (error?.config?.url?.includes('/dashboard/resident-finances')) {
      return 'Society finances couldn’t be loaded. Please try again in a moment.';
    }
    return 'We couldn’t connect to the server. Check your connection and try again.';
  }
  if (error?.code === 'ECONNABORTED') {
    return 'This is taking longer than expected. Please try again.';
  }
  if (!error?.response && !error?.config && !error?.isAxiosError) {
    if (context === 'Society Finances load') {
      return 'Society finances couldn’t be loaded. Please try again in a moment.';
    }
    return 'We couldn’t complete that request. Please try again.';
  }

  const status = error?.response?.status;
  const url = error?.config?.url || '';
  const method = (error?.config?.method || 'get').toLowerCase();

  if (status === 401 && url.includes('/auth/login')) {
    return 'We couldn’t sign you in. Check your email and password and try again.';
  }
  if (status === 401 && url.includes('/auth/google')) {
    return 'We couldn’t complete Google sign-in. Please try again.';
  }
  if (url.includes('/dashboard/resident-finances') && status >= 500) {
    return 'Society finances couldn’t be loaded. Please try again in a moment.';
  }
  if (status === 401) return 'Your session has ended. Sign in again to continue.';
  if (status === 403) return 'You don’t have access to this section. Contact your administrator if you need access.';
  if (status === 400 && method === 'get') return 'We couldn’t load this information. Refresh the page and try again.';
  if (status === 400 || status === 422) return 'Some information is missing or incorrect. Check the fields and try again.';
  if (status === 404) return 'We couldn’t find what you’re looking for. Refresh the page and try again.';
  if (status === 409) return 'This change conflicts with existing information. Review it and try again.';
  if (status === 429) return 'There have been too many attempts. Wait a moment, then try again.';
  if (status >= 500) return 'Something went wrong on our end. Please try again in a moment.';

  return 'We couldn’t complete that request. Please try again.';
};

export default api;
