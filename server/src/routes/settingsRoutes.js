import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { categorySchema, idParamSchema, settingsSchema } from '../validators/commonSchemas.js';

const router = Router();
const categoryIdSchema = idParamSchema.extend({ body: categorySchema.shape.body });

router.use(authenticate, authorize('admin'));
router.get('/', settingsController.get);
router.put('/', validate(settingsSchema), settingsController.update);
router.post('/categories', validate(categorySchema), settingsController.createCategory);
router.put('/categories/:id', validate(categoryIdSchema), settingsController.updateCategory);
router.delete('/categories/:id', validate(idParamSchema), settingsController.removeCategory);

export default router;
