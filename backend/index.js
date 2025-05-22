import express from 'express';
import cors from 'cors'; // Importa o middleware CORS
import bcrypt from 'bcrypt'; // For password hashing

const app = express();
const port = 3000;

app.use(cors()); // Permite requisições de origens diferentes
app.use(express.json()); // Middleware to parse JSON request bodies

// Temporary in-memory user storage
const users = [];

const bikeRacks = [
  { id: 1, name: 'Bicicletário Central', location: { lat: -22.817, lng: -47.068 }, availableSpots: 10 },
  { id: 2, name: 'Bicicletário Biblioteca', location: { lat: -22.818, lng: -47.065 }, availableSpots: 5 },
  { id: 3, name: 'Bicicletário Engenharia', location: { lat: -22.819, lng: -47.070 }, availableSpots: 8 },
];

app.get('/bike-racks', (req, res) => {
  res.status(200).json(bikeRacks);
});

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
    users.push({ email, password: hashedPassword }); // Store user
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

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;