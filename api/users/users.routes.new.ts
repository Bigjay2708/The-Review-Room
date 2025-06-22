import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { User, IUser } from '../models/user.model';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// Helper function to properly type Mongoose queries
const UserModel = User as mongoose.Model<IUser>;

// Input validation middleware
const validateRegisterInput = (req: Request, res: Response, next: () => void) => {
  const { username, email, password } = req.body;
  const errors: { [key: string]: string } = {};

  if (!username || username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Register User
router.post('/register', validateRegisterInput, async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;      // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      } else {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }    // Create new user - password hashing is handled by pre-save hook in model
    const user = new UserModel({
      username,
      email,
      password
    });

    await user.save();

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server error: JWT secret not configured' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });  } catch (error: any) {
    console.error('Registration error:', error);
    
    // More detailed error logging for debugging
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('MongoDB error code:', error.code);
    }
    
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Login User
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server error: JWT secret not configured' });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });  } catch (error: any) {
    console.error('Login error:', error);
    
    // More detailed error logging for debugging
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('MongoDB error code:', error.code);
    }
    
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Get user profile - protected route
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Since authMiddleware already provides user data in req.user, we can just return it
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Update user profile - protected route
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Initial validation
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (username && username.trim().length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    // Check for uniqueness if changing email or username
    if (email && email !== req.user.email) {      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    if (username && username !== req.user.username) {      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }      // Update user with changes
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          ...(username && { username }),
          ...(email && { email })
        } 
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Forgot password route
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email' });
    }
      const user = await UserModel.findOne({ email });
    if (!user) {
      // We don't want to reveal if the email exists or not for security
      // So we return a success message even if the email doesn't exist
      return res.status(200).json({ 
        message: 'If your email address exists in our database, you will receive a password recovery link shortly.' 
      });
    }

    // Generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save();

    // In a real app, you would send an email here with the reset token/link
    // For development/demo purposes, return the token in the response
    res.json({ 
      message: 'Password reset token generated. In a production environment, this would be emailed to you.',
      resetToken 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Reset password route
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Reset token is required' });
    }
      if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }
      
    // Hash the reset token to compare with the stored one
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
      
    // Find user with this token and check if token is still valid
    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }
    
    // Set the new password and clear reset fields
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();
    
    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

export default router;
