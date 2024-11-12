// auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); // Adjust the path to match your project structure
const router = express.Router();

// Login Route
router.post('/login', [
  check('gmail', 'Please enter a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { gmail, password } = req.body;

  try {
    let user = await User.findOne({ gmail });
    if (!user) {
      console.log('User does not exist');
      return res.status(401).json({ msg: 'User does not exist' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(401).json({ msg: 'Password incorrect' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
