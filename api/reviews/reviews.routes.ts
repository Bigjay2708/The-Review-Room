import express, { Request, Response } from 'express';
import { Review } from '../models/review.model';

const router = express.Router();

// Get all reviews for a movie
router.get('/movie/:movieId', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new review
router.post('/', async (req: Request, res: Response) => {
  try {
    const { movieId, userId, rating, comment } = req.body;
    
    const review = new Review({
      movieId,
      userId,
      rating,
      comment
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export = router;
