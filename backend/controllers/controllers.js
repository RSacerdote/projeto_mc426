import axios from 'axios';
import bcrypt from 'bcrypt';
import PhysicalRewardFactory from '../factories/PhysicalRewardFactory.js';
import DigitalRewardFactory from '../factories/DigitalRewardFactory.js';

const physicalRewardFactory = new PhysicalRewardFactory();
const digitalRewardFactory = new DigitalRewardFactory();

const users = [];

const bikeRacks = [
  { id: 1, name: 'Bicicletário Praça Central', location: { lat: -22.818003256227556, lng: -47.06962203506351 }, availableSpots: 10 },
  { id: 2, name: 'Bicicletário Biblioteca (BC)', location: { lat: -22.816430360289175, lng: -47.07138762234971 }, availableSpots: 5 },
  { id: 3, name: 'Bicicletário Engenharia Mecânica', location: { lat: -22.820034971899805, lng: -47.06608102530479 }, availableSpots: 8 },
  { id: 4, name: 'Bicicletário Inst. de Computação (IC)', location: { lat: -22.813694234447546, lng: -47.0639091153389 }, availableSpots: 12 },
  { id: 5, name: 'Bicicletário Ed. Física (FEF)', location: { lat: -22.815144741845387, lng: -47.072712200496504 }, availableSpots: 7 },
  { id: 6, name: 'Bicicletário Restaurante Univ. (RU)', location: { lat: -22.817543407104687, lng: -47.07159686208948 }, availableSpots: 20 },
  { id: 7, name: 'Bicicletário Ciclo Básico (CB)', location: { lat: -22.817404957602264, lng: -47.068967564305325 }, availableSpots: 18 },
  { id: 8, name: 'Bicicletário Ciências Médicas (FCM)', location: { lat: -22.829894514076685, lng: -47.06271183370368 }, availableSpots: 15 },
  { id: 9, name: 'Bicicletário Ciclo Básico (PB)', location: { lat: -22.817380234462032, lng: -47.0706687060641 }, availableSpots: 14 },
  { id: 10, name: 'Bicicletário Inst. Educação (IE)', location: { lat: -22.81562437783783, lng: -47.0650565057307 }, availableSpots: 10 },
  { id: 11, name: 'Bicicletário Inst. de Física (IFGW)', location: { lat: -22.817340175239323, lng: -47.06652671098709 }, availableSpots: 0 }
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

export async function getRoute(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).send({ error: 'Coordenadas de início e fim são obrigatórias.' });
  }

  try {
    const response = await axios.get(
      'https://api.openrouteservice.org/v2/directions/cycling-road',
      {
        params: {
          api_key: process.env.ORS_API_KEY,
          start: start,
          end: end,
        },
        headers: {
          // CORREÇÃO: 'utf-h8' foi corrigido para 'utf-8'
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
        },
      }
    );

    const coordinates = response.data.features[0].geometry.coordinates;
    const invertedCoordinates = coordinates.map(coord => [coord[1], coord[0]]);

    res.status(200).json(invertedCoordinates);

  } catch (error) {
    // Este bloco agora nos dará um erro mais detalhado se a chave de API estiver errada, por exemplo
    console.error('Erro ao buscar rota do ORS:', error.response ? error.response.data : error.message);
    res.status(500).send({ error: 'Não foi possível calcular a rota.' });
  }
}