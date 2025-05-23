import { Router } from 'express';
import { createPhysicalReward, createDigitalReward } from '../controllers/controllers.js';
import { validateSchema } from '../middlewares/validateSchema.js';
import { physicalRewardSchema, digitalRewardSchema } from '../schemas/schemas.js';

const router = Router();

router.post('/rewards/physical', validateSchema(physicalRewardSchema), createPhysicalReward);
router.post('/rewards/digital', validateSchema(digitalRewardSchema), createDigitalReward);

export default router;