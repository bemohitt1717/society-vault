import ApiError from '../utils/ApiError.js';

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to access this resource.'));
  }
  if (req.user.role === 'resident' && (!req.user.profileComplete || !req.user.profile)) {
    return next(new ApiError(403, 'Complete your resident profile to access this resource.'));
  }
  return next();
};

export default authorize;
