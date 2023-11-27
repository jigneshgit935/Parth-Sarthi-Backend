import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();
import User from '../Models/UserSchema.js';
import errorHandler from '../Middlewares/errorMiddleware.js';

function createResponse(ok, message, data) {
  return {
    ok,
    message,
    data,
  };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, password, email } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(409)
        .json(createResponse(false, 'Email already exists'));
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();
    return res
      .status(201)
      .json(createResponse(true, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(createResponse(false, 'Invalid Credentials'));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json(createResponse(false, 'Invalid Credentials'));
    }

    //generate jwt token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '10m' }
    );

    //generate refresh token
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '40m' }
    );

    res.cookie('authToken', authToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.status(201).json(createResponse(true, 'Login successfully'));
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);

export default router;
