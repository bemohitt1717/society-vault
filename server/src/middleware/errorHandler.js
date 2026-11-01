import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

const errorHandler = (error, req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'An unexpected server error occurred.';
  let details = error.details;

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Request data failed validation.';
    details = Object.values(error.errors).map(({ path, message: issue }) => ({ path, message: issue }));
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'A request value is invalid.';
  } else if (error?.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists.';
    details = error.keyValue;
  } else if (!(error instanceof ApiError)) {
    console.error('[API] Unhandled request error:', error);
    if (process.env.NODE_ENV === 'production') message = 'An unexpected server error occurred.';
  }

  return res.status(statusCode).json({
    error: { message, ...(details ? { details } : {}) },
  });
};

export default errorHandler;
