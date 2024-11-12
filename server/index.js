// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

dotenv.config(); // Load environment variables from .env file

const app = express();

// Enable CORS for your frontend URL (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Adjust this based on your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Registration route
app.post('/api/users/register', async (req, res) => {
  const { firstname, lastname, dob, age, gmail, password, primaryContactNumber, alternateContactNumber, address, cycleDay, problems } = req.body;

  try {
    // Check if the user already exists
    const existingUser  = await User.findOne({ gmail });
    if (existingUser ) {
      return res.status(400).json({ message: 'User  already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser  = new User({
      firstname,
      lastname,
      dob,
      age,
      gmail,
      password: hashedPassword,
      primaryContactNumber,
      alternateContactNumber,
      address,
      cycleDay,
      problems,
    });

    await newUser .save();
    res.status(201).json({ message: 'User  registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
app.post('/api/users/login', async (req, res) => {
  const { gmail, password } = req.body;

  try {
    // Find the user by gmail
    const user = await User.findOne({ gmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid gmail or password' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid gmail or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});