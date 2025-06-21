import { api } from './api';
import { Review, ReviewFormData } from '../types';

// Fetch reviews for a specific movie
export const fetchReviews = async (movieId: number): Promise<Review[]> => {
  try {
    const response = await api.get<Review[]>(`/reviews/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for movie ${movieId}:`, error);
    throw error;
  }
};

// Submit a new review for a movie
export const submitReview = async (review: ReviewFormData): Promise<Review> => {
  try {
    const response = await api.post<Review>(`/reviews/movie/${review.movieId}`, {
      rating: review.rating,
      comment: review.comment
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Update an existing review
export const updateReview = async (reviewId: string, data: { rating?: number; comment?: string }): Promise<Review> => {
  try {
    const response = await api.put<Review>(`/reviews/${reviewId}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await api.delete(`/reviews/${reviewId}`);
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error);
    throw error;
  }
};
