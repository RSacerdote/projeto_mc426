import { Router } from "express"
import { completeTask, createTask, getBikeRacks, getTask, getTasks, signIn, signUp } from "../controllers/controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { authSchema, completeTaskSchema, postTaskSchema } from "../schemas/schemas.js";

const router = Router()

router.get('/tasks', getTasks);
router.get('/tasks/:taskId', getTask);
router.post('/tasks', validateSchema(postTaskSchema), createTask);
router.post('/tasks/:taskId/complete', validateSchema(completeTaskSchema), completeTask);
router.post('/signup', validateSchema(authSchema), signUp);
router.post('/signin', validateSchema(authSchema), signIn);
router.get('/bike-racks', getBikeRacks);

export default router