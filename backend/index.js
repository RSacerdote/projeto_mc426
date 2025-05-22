import express from 'express';
import bcrypt from 'bcrypt'; // For password hashing
import joi from "joi"
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

function validateSchema (schema) {
  return (req,res,next)=>{
      const schemaValidation = schema.validate(req.body, {abortEarly: false})
      if(schemaValidation.error){
          const errors = schemaValidation.error.details.map((detail)=> detail.message)
          return res.status(422).send(errors)
      }
      next()
  }
}

// Temporary in-memory storage
const users = [];

const tasks = [{
  id: 1,
  title: 'Task 1',
  description: 'Description for Task 1',
  credits: 10,
}];

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    users.push({ email, password: hashedPassword, credits: 0 }); // Store user
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Signin endpoint
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Signin successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});

const postTaskSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  credits: joi.number().integer().min(1).required(),
})

const completeTaskSchema = joi.object({
  userEmail: joi.string().required(),
})

function getTasks(req, res) {
  res.status(200).send(tasks)
}

function getTask(req, res) {
  const {taskId} = req.params
  const task = tasks.find(task => task.id === Number(taskId))
  if (!task) {
    return res.status(404).send({ error: 'Task not found' })
  }
  res.status(200).send(task)
}

function createTask(req, res) {
  const { title, description, credits } = req.body
  if (!title || !description || !credits) {
    return res.status(400).send({ error: 'Title, description, and credits are required' })
  }
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    credits,
  }
  tasks.push(newTask)
  res.status(201).send(newTask)
}

function completeTask(req, res) {
  const { taskId } = req.params
  const { userEmail } = req.body // TODO: use userId instead of email
  const taskIndex = tasks.findIndex(task => task.id === Number(taskId))
  if (taskIndex === -1) {
    return res.status(404).send({ error: 'Task not found' })
  }
  const userIndex = users.findIndex(user => user.email === userEmail)
  if (userIndex === -1) {
    return res.status(404).send({ error: 'User not found' })
  }
  const user = users[userIndex]
  const task = tasks[taskIndex]
  user.credits += task.credits
  res.status(200).send({email:user.email, credits: user.credits})
}

app.get('/tasks', getTasks);

app.get('/tasks/:taskId', getTask);

app.post('/tasks', validateSchema(postTaskSchema), createTask);

app.post('/tasks/:taskId/complete', validateSchema(completeTaskSchema), completeTask);

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app