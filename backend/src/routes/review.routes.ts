import express, { Request, Response } from 'express';
import { Review } from '../models/review.model';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Get all reviews for a movie
router.get('/movie/:movieId', asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ movieId: req.params.movieId })
    .sort({ createdAt: -1 });
  res.json(reviews);
}));

export const reviewRoutes = router; 