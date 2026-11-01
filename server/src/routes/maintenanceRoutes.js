import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenanceController.js';
import authenticate from '../middleware/authenticate.js';
import authorize from '../middleware/authorize.js';
import validate from '../middleware/validate.js';
import { idParamSchema, listQuerySchema } from '../validators/commonSchemas.js';
import { z } from 'zod';

const router = Router();
const maintenanceSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(120),
    date: z.coerce.date(),
    time: z.string().trim().max(40).optional().default(''),
    description: z.string().trim().max(500).optional().default(''),
    status: z.enum(['scheduled', 'completed', 'cancelled']).optional().default('scheduled'),
  }),
});
const maintenanceIdSchema = idParamSchema.extend({ body: maintenanceSchema.shape.body });

router.use(authenticate);
router.get('/upcoming', authorize('resident', 'admin'), validate(listQuerySchema), maintenanceController.listUpcoming);
router.post('/', authorize('admin'), validate(maintenanceSchema), maintenanceController.create);
router.put('/:id', authorize('admin'), validate(maintenanceIdSchema), maintenanceController.update);
router.delete('/:id', authorize('admin'), validate(idParamSchema), maintenanceController.remove);

export default router;
