import express, { Request, Response } from 'express';
import { Review } from '../models/review.model';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Get all reviews for a movie
router.get('/movie/:movieId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error in GET /api/reviews/movie/:movieId:', error);
    res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : error });
  }
});

export const reviewRoutes = router;