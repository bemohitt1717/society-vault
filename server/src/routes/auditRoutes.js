import { Router } from 'express';
import { z } from 'zod';
import { list } from '../controllers/auditController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { listQuerySchema } from '../validators/commonSchemas.js';

const router = Router();
const auditQuerySchema = listQuerySchema.extend({
  query: listQuerySchema.shape.query.safeExtend({ entity: z.string().trim().max(80).optional() }),
});

router.get('/', authenticate, authorize('admin'), validate(auditQuerySchema), list);

export default router;
