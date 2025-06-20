import bcrypt from 'bcrypt';
import PhysicalRewardFactory from '../factories/PhysicalRewardFactory.js';
import DigitalRewardFactory from '../factories/DigitalRewardFactory.js';

const physicalRewardFactory = new PhysicalRewardFactory();
const digitalRewardFactory = new DigitalRewardFactory();

const users = [];

const bikeRacks = [
  { id: 1, name: 'Bicicletário Central', location: { lat: -22.817, lng: -47.068 }, availableSpots: 10 },
  { id: 2, name: 'Bicicletário Biblioteca', location: { lat: -22.818, lng: -47.065 }, availableSpots: 5 },
  { id: 3, name: 'Bicicletário Engenharia', location: { lat: -22.819, lng: -47.070 }, availableSpots: 8 },
];

const tasks = [{
  id: 1,
  title: 'Task 1',
  description: 'Description for Task 1',
  credits: 10,
}];

export function createPhysicalReward(req, res) {
  const { name, pointsRequired, startDate, endDate, shippingAddress } = req.body;
  const reward = physicalRewardFactory.createReward(name, pointsRequired, startDate, endDate, shippingAddress);
  res.status(201).send(reward);
}

export function createDigitalReward(req, res) {
  const { name, pointsRequired, startDate, endDate, email } = req.body;
  const reward = digitalRewardFactory.createReward(name, pointsRequired, startDate, endDate, email);
  res.status(201).send(reward);
}

export function getTasks(req, res) {
  res.status(200).send(tasks)
}

export function getTask(req, res) {
  const {taskId} = req.params
  const task = tasks.find(task => task.id === Number(taskId))
  if (!task) {
    return res.status(404).send({ error: 'Task not found' })
  }
  res.status(200).send(task)
}

export function createTask(req, res) {
  const { title, description, credits } = req.body
  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    credits,
  }
  tasks.push(newTask)
  res.status(201).send(newTask)
}

export function completeTask(req, res) {
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

export async function signUp(req, res){
  const { email, password } = req.body;

  try {
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword, credits: 0 });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
}

export async function signIn(req, res) {
  const { email, password } = req.body;

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
}

export function getBikeRacks(req, res) {
    const { north, south, east, west } = req.query;

    if (north && south && east && west) {
        const visibleRacks = bikeRacks.filter(rack => {
            const { lat, lng } = rack.location;
            return lat <= north && lat >= south && lng <= east && lng >= west;
        });
        return res.status(200).json(visibleRacks);
    }
    
    res.status(200).json(bikeRacks);
}