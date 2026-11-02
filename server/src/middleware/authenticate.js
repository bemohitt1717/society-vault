import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const authenticate = asyncHandler(async (req, _res, next) => {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) throw new ApiError(401, 'Sign in to continue.');

  let claims;
  try {
    claims = jwt.verify(token, env.JWT_SECRET, { issuer: 'societyvault-api' });
  } catch {
    throw new ApiError(401, 'Your session is invalid or expired. Sign in again.');
  }

  const user = await User.findById(claims.sub).select('+passwordHash');
  if (!user || user.status !== 'active' || user.role !== claims.role) {
    throw new ApiError(401, 'Your account session is no longer active. Sign in again.');
  }
  req.user = user;
  return next();
});

export default authenticate;
