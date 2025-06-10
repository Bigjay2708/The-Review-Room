import express, { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { auth } from '../middleware/auth.middleware';
import { IUser } from '../models/user.model';
import logger from '../utils/logger'; // Import the logger utility
import asyncHandler from 'express-async-handler';

interface AuthRequest extends Request {
  user?: IUser;
}

const router = express.Router();

// Create a review
router.post('/', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { movieId, rating, content } = req.body;
  const review = new Review({
    movieId,
    userId: req.user?._id,
    rating,
    content,
  });
  await review.save();
  res.status(201).json(review);
}));

// Get reviews for a movie
router.get('/movie/:movieId', asyncHandler(async (req: Request, res: Response) => {
  const movieId = parseInt(req.params.movieId);
  const reviews = await Review.find({ movieId })
    .populate('userId', 'username')
    .sort({ createdAt: -1 });
  res.json(reviews);
}));

// Get user's reviews
router.get('/user', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const reviews = await Review.find({ userId: req.user?._id })
    .sort({ createdAt: -1 });
  res.json(reviews);
}));

// Update a review
router.patch('/:id', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findOne({
    _id: req.params.id,
    userId: req.user?._id,
  });

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  const updates = Object.keys(req.body);
  updates.forEach((update) => {
    (review as any)[update] = req.body[update];
  });

  await review.save();
  res.json(review);
}));

// Delete a review
router.delete('/:id', auth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    userId: req.user?._id,
  });

  if (!review) {
    res.status(404).json({ error: 'Review not found' });
    return;
  }

  res.json(review);
}));

export const reviewRoutes = router; 