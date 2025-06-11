import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import { User, IUser } from '../models/user.model';
import { auth } from '../middleware/auth.middleware';
import logger from '../utils/logger';
import asyncHandler from 'express-async-handler';
import { authLimiter } from '../middleware/rateLimit.middleware';

interface AuthRequest extends Request {
  user?: IUser;
}

const router = express.Router();

// Register a new user
router.post(
  '/register',
  // authLimiter, // Temporarily commented out for debugging
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    // Temporarily log the entire request body for debugging
    // REMOVE THIS LOGGING IN PRODUCTION!
    console.log('Login Request Body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password } = req.body;

    // Check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Check if username already exists
    user = await User.findOne({ username });
    if (user) {
      res.status(400).json({ message: 'User with this username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
  })
);

// Login user
router.post(
  '/login',
  // authLimiter, // Temporarily commented out for debugging
  [
    check('identifier', 'Please provide a valid email or username').not().isEmpty(),
    check('password', 'Password is required').exists(),
  ],
  asyncHandler(async (req: Request, res: Response) => {
    // Temporarily log the entire request body for debugging
    // REMOVE THIS LOGGING IN PRODUCTION!
    console.log('Login Request Body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid login credentials' });
      return;
    }

    // Temporarily log values for debugging
    // REMOVE THIS LOGGING IN PRODUCTION!
    console.log('Login Attempt:', {
      identifierReceived: identifier,
      passwordReceived: password,
      userFoundId: user._id,
      userFoundUsername: user.username,
      userFoundEmail: user.email,
      userFoundHashedPassword: user.password,
    });

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid login credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  })
);

// Get user profile
router.get('/profile', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  res.json(req.user);
}));

export const userRoutes = router;