import axios from 'axios';
import { Review, ReviewFormData } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://the-review-room.onrender.com/api'
  : 'http://localhost:5000/api';

export const fetchReviews = async (movieId: number): Promise<Review[]> => {
  const response = await axios.get<Review[]>(`${API_BASE_URL}/reviews/movie/${movieId}`);
  return response.data as Review[];
};

export const submitReview = async (review: ReviewFormData): Promise<Review> => {
  const response = await axios.post<Review>(`${API_BASE_URL}/reviews/movie/${review.movieId}`, review);
  return response.data as Review;
};
