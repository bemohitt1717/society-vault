import api, { clearAuthToken, setAuthToken } from './http';

const saveSession = ({ data }) => {
  const { token, user } = data.data;
  setAuthToken(token);
  return user;
};

export const registerResident = async (credentials) => saveSession(await api.post('/auth/register', credentials));
export const login = async (credentials) => saveSession(await api.post('/auth/login', credentials));
export const loginWithGoogle = async (idToken) => saveSession(await api.post('/auth/google', { idToken }));
export const getCurrentUser = async () => (await api.get('/auth/me')).data.data;
export const updateResidentProfile = async (profile, password) => (
  await api.put('/auth/profile', { profile, ...(password ? { password } : {}) })
).data.data;
export const updateAccountProfile = async (name) => (await api.put('/auth/profile', { name })).data.data;
export const requestPasswordReset = async (email) => (await api.post('/auth/password-reset', { email })).data.data;
export const clearSession = () => clearAuthToken();
