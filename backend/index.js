const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON request bodies

// Temporary in-memory user storage
const users = [];

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

if(require.main === module) {
  // If this file is run directly, start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
module.exports = app; // Export the app for testing