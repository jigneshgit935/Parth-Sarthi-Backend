import express from 'express';
const router = express.Router();
import User from '../Models/UserSchema.js';

router.get('/test', async (req, res) => {
  res.json({ message: 'Auth Api is Working' });
});

router.post('/register', async (req, res) => {
  try {
    const { name, password, email } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });

    cosnt;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
