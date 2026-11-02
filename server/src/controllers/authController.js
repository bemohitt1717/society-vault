import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import {
  authenticateWithFirebase,
  authenticateWithPassword,
  registerResident,
  toPublicUser,
  updateAdminProfile,
  updateResidentProfile,
} from '../services/authService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendData } from '../utils/response.js';
import ApiError from '../utils/ApiError.js';

const startSession = (user) => {
  const token = jwt.sign(
    { role: user.role },
    env.JWT_SECRET,
    { subject: user.id, expiresIn: env.JWT_EXPIRES_IN, issuer: 'societyvault-api' },
  );
  return { token, user: toPublicUser(user) };
};

export const register = asyncHandler(async (req, res) => {
  const user = await registerResident(req.validated.body);
  return sendData(res, startSession(user), 201);
});

export const login = asyncHandler(async (req, res) => {
  const user = await authenticateWithPassword(req.validated.body);
  return sendData(res, startSession(user));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const user = await authenticateWithFirebase(req.validated.body.idToken);
  return sendData(res, startSession(user));
});

export const requestPasswordReset = (_req, _res, next) => {
  next(new ApiError(503, 'Password reset is unavailable until an email delivery provider is configured.'));
};

export const currentUser = asyncHandler(async (req, res) => sendData(res, toPublicUser(req.user)));

export const updateProfile = asyncHandler(async (req, res) => {
  if (req.user.role === 'admin' && !req.validated.body.name) {
    throw new ApiError(400, 'Provide a name for your administrator profile.');
  }
  if (req.user.role === 'resident' && !req.validated.body.profile) {
    throw new ApiError(400, 'Provide your resident profile details.');
  }
  const user = req.user.role === 'admin'
    ? await updateAdminProfile(req.user.id, req.validated.body.name)
    : await updateResidentProfile(req.user.id, { ...req.validated.body.profile, password: req.validated.body.password });
  return sendData(res, toPublicUser(user));
});
