import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';
import validate from '../middleware/validate.js';
import {
  googleLoginSchema,
  loginSchema,
  passwordResetSchema,
  registerSchema,
  accountProfileSchema,
} from '../validators/commonSchemas.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: { message: 'Too many sign-in attempts. Try again in 15 minutes.' } },
});

router.post('/register', loginLimiter, validate(registerSchema), authController.register);
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/google', loginLimiter, validate(googleLoginSchema), authController.googleLogin);
router.post('/password-reset', loginLimiter, validate(passwordResetSchema), authController.requestPasswordReset);
router.get('/me', authenticate, authController.currentUser);
router.put('/profile', authenticate, validate(accountProfileSchema), authController.updateProfile);

export default router;
