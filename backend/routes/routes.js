import { Router } from "express"
import { completeTask, createTask, getBikeRacks, getRoute, getTask, getTasks, signIn, signUp } from "../controllers/controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { authSchema, completeTaskSchema, postTaskSchema } from "../schemas/schemas.js";
import rewardsRoutes from './rewardsRoutes.js';

const router = Router()

router.use(rewardsRoutes);
router.get('/tasks', getTasks);
router.get('/tasks/:taskId', getTask);
router.post('/tasks', validateSchema(postTaskSchema), createTask);
router.post('/tasks/:taskId/complete', validateSchema(completeTaskSchema), completeTask);
router.post('/signup', validateSchema(authSchema), signUp);
router.post('/signin', validateSchema(authSchema), signIn);
router.get('/bike-racks', getBikeRacks);
router.get('/route', getRoute);

export default router