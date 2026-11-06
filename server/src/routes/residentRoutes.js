import { Router } from 'express';
import * as residentController from '../controllers/residentController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import {
  dueSchema,
  idParamSchema,
  listQuerySchema,
  residentDuesByIdSchema,
  residentDuesListSchema,
  residentSchema,
} from '../validators/commonSchemas.js';

const router = Router();
const residentIdSchema = idParamSchema.extend({ body: residentSchema.shape.body });
const residentListSchema = listQuerySchema;

router.use(authenticate);
router.get('/me/dues', authorize('resident'), validate(residentDuesListSchema), residentController.listDues);
router.get('/me/dashboard', authorize('resident'), residentController.dashboard);

router.use(authorize('admin'));
router.get('/', validate(residentListSchema), residentController.list);
router.get('/dues', validate(residentListSchema), residentController.listDuesForAdmin);
router.put('/:id', validate(residentIdSchema), residentController.update);
router.delete('/:id', validate(idParamSchema), residentController.remove);
router.get('/:id/dues', validate(residentDuesByIdSchema), residentController.listAllDues);
router.post('/dues', validate(dueSchema), residentController.createDue);

export default router;
