import express, { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { auth } from '../middleware/auth.middleware';
import asyncHandler from 'express-async-handler';
import axios from 'axios';

const router = express.Router();

// Register a new user
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  })
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: 'Invalid login credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid login credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({
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
router.get('/profile', auth, asyncHandler(async (req: Request & { user?: any }, res: Response, next: NextFunction): Promise<void> => {
  const user = await User.findById(req.user?._id).select('-password');
  res.json(user);
}));

// Request password reset
router.post(
  '/forgot-password',
  [
    check('email', 'Please include a valid email').isEmail(),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Even if user doesn't exist, send a success message to prevent email enumeration
      res.json({ message: 'If a user with that email exists, a password reset link will be sent.' });
      return;
    }

    // Generate and save password reset token (example: using a simple hash)
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // In a real application, you would send an email here
    // For now, let's just log the reset token
    console.log(`Password reset token for ${user.email}: ${resetToken}`);

    res.json({ message: 'If a user with that email exists, a password reset link will be sent.' });
  })
);

// Reset password
router.post(
  '/reset-password',
  [
    check('token', 'Token is required').not().isEmpty(),
    check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { token, newPassword } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  })
);

// Google Login
router.post(
  '/google-login',
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.body;

    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
      const { email, name } = response.data;

      let user = await User.findOne({ email });
      if (!user) {
        // Create new user if not exists
        user = new User({ username: name, email, password: Math.random().toString(36).slice(-8) }); // Placeholder password
        await user.save();
      }

      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.status(200).json({
        token: jwtToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error('Google login error:', error.message);
      res.status(400).json({ message: 'Google login failed' });
    }
  })
);

// GitHub Login
router.post(
  '/github-login',
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { code } = req.body;

    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );

      const accessToken = tokenResponse.data.access_token;

      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });
      const { login: githubUsername, email: githubEmail, id: githubId } = userResponse.data;

      // Get email from another endpoint if not directly available
      let email = githubEmail;
      if (!email) {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        });
        const primaryEmail = emailsResponse.data.find((e: any) => e.primary && e.verified);
        if (primaryEmail) {
          email = primaryEmail.email;
        }
      }

      if (!email) {
        res.status(400).json({ message: 'Could not retrieve email from GitHub' });
        return;
      }

      let user = await User.findOne({ email });
      if (!user) {
        // Create new user if not exists
        user = new User({ username: githubUsername, email, password: Math.random().toString(36).slice(-8) }); // Placeholder password
        await user.save();
      }

      const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      res.status(200).json({
        token: jwtToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error: any) {
      console.error('GitHub login error:', error.message);
      res.status(400).json({ message: 'GitHub login failed' });
    }
  })
);

export const userRoutes = router; 