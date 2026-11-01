import { Router } from 'express';
import * as expenseController from '../controllers/expenseController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { expenseSchema, idParamSchema, listQuerySchema } from '../validators/commonSchemas.js';

const router = Router();
const expenseIdSchema = idParamSchema.extend({ body: expenseSchema.shape.body });
const expenseQuerySchema = listQuerySchema.extend({
  query: listQuerySchema.shape.query.safeExtend({ status: expenseSchema.shape.body.shape.paymentStatus.optional() }),
});

router.use(authenticate, authorize('admin'));
router.get('/', validate(expenseQuerySchema), expenseController.list);
router.post('/', validate(expenseSchema), expenseController.create);
router.put('/:id', validate(expenseIdSchema), expenseController.update);
router.delete('/:id', validate(idParamSchema), expenseController.remove);

export default router;
