import { Router } from 'express';
import * as paymentController from '../controllers/paymentController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import {
  adminPaymentSchema,
  idParamSchema,
  listQuerySchema,
  paymentStatusSchema,
  residentPaymentSchema,
} from '../validators/commonSchemas.js';
import { z } from 'zod';

const router = Router();
const paymentListSchema = listQuerySchema.extend({
  query: listQuerySchema.shape.query.safeExtend({ status: z.enum(['pending', 'completed', 'failed', 'refunded']).optional() }),
});
const adminPaymentIdSchema = paymentStatusSchema;

router.use(authenticate);
router.get('/mine', authorize('resident'), validate(paymentListSchema), paymentController.listMine);
router.get('/receipts', authorize('resident'), validate(listQuerySchema), paymentController.listReceipts);
router.post('/initiate', authorize('resident'), validate(residentPaymentSchema), paymentController.initiate);
router.get('/report', authorize('resident'), validate(listQuerySchema), paymentController.residentReport);

router.get('/', authorize('admin'), validate(paymentListSchema), paymentController.listAll);
router.post('/manual', authorize('admin'), validate(adminPaymentSchema), paymentController.createManual);
router.patch('/:id/status', authorize('admin'), validate(adminPaymentIdSchema), paymentController.updateStatus);
router.get('/:id', authorize('admin'), validate(idParamSchema), paymentController.getOne);

export default router;
