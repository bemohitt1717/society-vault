import api from './http';

export const registerResident = async (credentials) => (await api.post('/auth/register', credentials)).data.data;
export const login = async (credentials) => (await api.post('/auth/login', credentials)).data.data;
export const loginWithGoogle = async (idToken) => (await api.post('/auth/google', { idToken })).data.data;
export const getCurrentUser = async () => (await api.get('/auth/me')).data.data;
export const updateResidentProfile = async (profile, password) => (
  await api.put('/auth/profile', { profile, ...(password ? { password } : {}) })
).data.data;
export const updateAccountProfile = async (name) => (await api.put('/auth/profile', { name })).data.data;
export const requestPasswordReset = async (email) => (await api.post('/auth/password-reset', { email })).data.data;
export const logout = async () => (await api.post('/auth/logout')).data.data;
