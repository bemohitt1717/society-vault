import { Router } from 'express';
import * as incomeController from '../controllers/incomeController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { idParamSchema, incomeSchema, listQuerySchema } from '../validators/commonSchemas.js';
import { z } from 'zod';

const router = Router();
const incomeIdSchema = idParamSchema.extend({ body: incomeSchema.shape.body });
const incomeQuerySchema = listQuerySchema.extend({
  query: listQuerySchema.shape.query.safeExtend({ paymentMode: z.enum(['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card']).optional() }),
});

router.use(authenticate, authorize('admin'));
router.get('/', validate(incomeQuerySchema), incomeController.list);
router.post('/', validate(incomeSchema), incomeController.create);
router.put('/:id', validate(incomeIdSchema), incomeController.update);
router.delete('/:id', validate(idParamSchema), incomeController.remove);

export default router;
