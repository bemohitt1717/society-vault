import bcrypt from 'bcryptjs';
import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';

const BCRYPT_ROUNDS = 12;

const getFirebaseAuth = () => {
  if (!env.FIREBASE_PROJECT_ID) {
    throw new ApiError(503, 'Google sign-in is not configured on the server yet.');
  }

  if (!getApps().length) {
    const credential = env.GOOGLE_APPLICATION_CREDENTIALS
      ? cert(env.GOOGLE_APPLICATION_CREDENTIALS)
      : applicationDefault();
    initializeApp({ credential, projectId: env.FIREBASE_PROJECT_ID });
  }
  return getAuth();
};

const toPublicUser = (user) => ({
  id: user.id,
  name: user.name || user.profile?.name || '',
  email: user.email,
  role: user.role,
  status: user.status,
  profileComplete: user.profileComplete,
  profile: user.profile,
  hasPassword: Boolean(user.passwordHash),
});

export const registerResident = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    const invitedResident = await User.findOne({ email: normalizedEmail, role: 'resident', status: 'invited' });
    if (invitedResident) {
      invitedResident.passwordHash = passwordHash;
      invitedResident.status = 'active';
      invitedResident.profileComplete = Boolean(invitedResident.profile?.name);
      await invitedResident.save();
      return invitedResident;
    }

    const user = await User.create({
      email: normalizedEmail,
      passwordHash,
      role: 'resident',
      status: 'active',
      profileComplete: false,
    });
    return user;
  } catch (error) {
    if (error?.code === 11000) {
      throw new ApiError(409, 'An account with this email already exists. Sign in instead.');
    }
    throw error;
  }
};

export const authenticateWithPassword = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, 'Email or password is incorrect.');
  }
  if (user.status !== 'active') throw new ApiError(403, 'This account is not active.');
  user.lastLoginAt = new Date();
  await user.save();
  return user;
};

export const authenticateWithFirebase = async (idToken) => {
  let decoded;
  try {
    decoded = await getFirebaseAuth().verifyIdToken(idToken, true);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, 'Google sign-in could not be verified. Please sign in again.');
  }

  if (!decoded.email || !decoded.email_verified) {
    throw new ApiError(403, 'Use a Google account with a verified email address.');
  }

  let user = await User.findOne({
    $or: [{ firebaseUid: decoded.uid }, { email: decoded.email.toLowerCase() }],
  }).select('+passwordHash +firebaseUid');
  if (user?.role === 'admin') {
    throw new ApiError(403, 'Google sign-in is only available for resident accounts.');
  }
  if (user?.status === 'invited' && user.role === 'resident') {
    user.firebaseUid = decoded.uid;
    user.status = 'active';
    user.profileComplete = Boolean(user.profile?.name);
  } else if (user && user.status !== 'active') {
    throw new ApiError(403, 'This account is not active.');
  }

  if (!user) {
    user = await User.create({
      email: decoded.email.toLowerCase(),
      firebaseUid: decoded.uid,
      role: 'resident',
      profileComplete: false,
    });
  } else if (!user.firebaseUid) {
    user.firebaseUid = decoded.uid;
  }

  user.lastLoginAt = new Date();
  await user.save();
  return user;
};

export const updateResidentProfile = async (userId, profile) => {
  const { password } = profile;
  const residentProfile = Object.fromEntries(
    Object.entries(profile).filter(([key]) => key !== 'password'),
  );
  const user = await User.findOne({ _id: userId, role: 'resident', status: 'active' }).select('+passwordHash');
  if (!user) throw new ApiError(404, 'Resident account not found.');
  if (password && user.passwordHash) {
    throw new ApiError(409, 'This account already has a password. Password changes are not available here.');
  }
  if (password) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, role: 'resident', status: 'active', passwordHash: { $exists: false } },
      { $set: { profile: residentProfile, profileComplete: true, passwordHash } },
      { new: true, runValidators: true },
    ).select('+passwordHash');
    if (updatedUser) return updatedUser;

    const stillExists = await User.exists({ _id: userId, role: 'resident', status: 'active' });
    if (!stillExists) throw new ApiError(404, 'Resident account not found.');
    throw new ApiError(409, 'This account already has a password. Password changes are not available here.');
  }

  user.profile = residentProfile;
  user.profileComplete = true;
  await user.save();
  return user;
};

export const updateAdminProfile = async (userId, name) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, role: 'admin', status: 'active' },
    { $set: { name } },
    { new: true, runValidators: true },
  );
  if (!user) throw new ApiError(404, 'Administrator account not found.');
  return user;
};

export { toPublicUser };
