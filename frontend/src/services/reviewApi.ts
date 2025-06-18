import axios from 'axios';
import { Review, ReviewFormData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const fetchReviews = async (movieId: number): Promise<Review[]> => {
  const response = await axios.get<Review[]>(`${API_BASE_URL}/reviews/movie/${movieId}`);
  return response.data as Review[];
};

export const submitReview = async (review: ReviewFormData): Promise<Review> => {
  const response = await axios.post<Review>(`${API_BASE_URL}/reviews/movie/${review.movieId}`, review);
  return response.data as Review;
};
