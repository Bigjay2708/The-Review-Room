import express, { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { authMiddleware } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = express.Router();

// Get all reviews for a movie
router.get('/movie/:movieId', async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.movieId);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Add a new review - protected route requiring authentication
router.post('/movie/:movieId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.movieId);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID format' });
    }

    const { rating, comment } = req.body;
    
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (!comment || comment.trim() === '') {
      return res.status(400).json({ message: 'Comment is required' });
    }
      if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({ 
      movieId, 
      userId: req.user._id 
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        message: 'You have already reviewed this movie. You can update your existing review instead.' 
      });
    }
      if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Create new review using authenticated user
    const review = new Review({
      movieId,
      userId: req.user._id,
      username: req.user.username,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Update an existing review - protected route
router.put('/:reviewId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    
    // Validate input
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (comment !== undefined && comment.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }
    
    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
      if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user is the review author
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }
    
    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { 
        $set: { 
          ...(rating !== undefined && { rating }),
          ...(comment !== undefined && { comment }),
          updatedAt: new Date().toISOString()
        } 
      },
      { new: true }
    );
    
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

// Delete a review - protected route
router.delete('/:reviewId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    
    // Find the review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
      if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check if user is the review author
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }
    
    // Delete review
    await Review.findByIdAndDelete(reviewId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
});

export default router;
