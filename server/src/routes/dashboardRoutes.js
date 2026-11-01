import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import * as paymentController from '../controllers/paymentController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { listQuerySchema } from '../validators/commonSchemas.js';

const router = Router();
router.use(authenticate);
router.get('/admin', authorize('admin'), dashboardController.adminDashboard);
router.get('/resident-finances', authorize('resident'), validate(listQuerySchema), dashboardController.residentFinances);
router.get('/reports/financial', authorize('admin'), dashboardController.reports);
router.get('/reports/resident', authorize('resident'), validate(listQuerySchema), paymentController.residentReport);

export default router;
