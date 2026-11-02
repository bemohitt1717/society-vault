import axios from 'axios';
import { signInWithPopup, signOut } from 'firebase/auth';
import {
  getCurrentUser as getCurrentUserRequest,
  login as loginRequest,
  loginWithGoogle,
  clearSession,
  requestPasswordReset,
  registerResident,
  updateAccountProfile,
  updateResidentProfile,
} from '../../../services/api/authApi';
import { auth, googleProvider } from '../../../firebase/firebase';

export const registerUser = async (email, password, role = 'resident') => {
  if (role !== 'resident') {
    throw new Error('Administrator accounts can only be created by the system administrator.');
  }
  return registerResident({ email, password });
};

export const loginUser = async (email, password, role) => {
  const user = await loginRequest({ email, password });
  if (role && user.role !== role) {
    clearSession();
    throw new Error(`This account is registered as ${user.role === 'admin' ? 'Administrator' : 'Resident'}.`);
  }
  return user;
};

export const saveResidentAccountProfile = async (_email, profile) => {
  const { password, ...residentProfile } = profile;
  return updateResidentProfile(residentProfile, password);
};

export const saveAdminAccountProfile = async (name) => updateAccountProfile(name);

export const getCurrentUser = async () => {
  try {
    return await getCurrentUserRequest();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    clearSession();
  } finally {
    await signOut(auth);
  }
};

export const sendPasswordReset = async (email) => {
  return requestPasswordReset(email);
};

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  try {
    const firebaseToken = await result.user.getIdToken();
    const user = await loginWithGoogle(firebaseToken);
    return user.profileComplete
      ? user
      : { ...user, profile: { ...(user.profile || {}), name: result.user.displayName || '' } };
  } catch (error) {
    await signOut(auth);
    throw error;
  }
};

export const googleLogout = async () => signOut(auth);
