const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

// Register a new user
router.post('/register', [
  check('firstname', 'Please enter a first name').not().isEmpty(),
  check('lastname', 'Please enter a last name').not().isEmpty(),
  check('dob', 'Please enter a valid date of birth').isDate(),
  check('age', 'Please enter a valid age').isNumeric(),
  check('gmail', 'Please enter a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('primaryContactNumber', 'Please enter a valid primary contact number').isNumeric()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstname, lastname, dob, age, gmail, password, primaryContactNumber, alternateContactNumber, address, cycleDay, problems } = req.body;

  try {
    let user = await User.findOne({ gmail });
    if (user) return res.status(400).json({ errors: [{ msg: 'User already exists' }] });

    user = new User({ firstname, lastname, dob, age, gmail, password, primaryContactNumber, alternateContactNumber, address, cycleDay, problems });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
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
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Optionally, you can generate a JWT token here if you want to implement token-based authentication
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: 3600 });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
