import axios from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Review,
  ReviewFormData,
  UpdateReviewData,
  Movie,
  User,
} from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users/profile');
    return response.data;
  },
};

export const movies = {
  getPopular: async (page = 1): Promise<{ results: Movie[]; total_pages: number }> => {
    const response = await api.get<{ results: Movie[]; total_pages: number }>(
      `/movies/popular?page=${page}`
    );
    return response.data;
  },

  search: async (query: string, page = 1): Promise<{ results: Movie[]; total_pages: number }> => {
    const response = await api.get<{ results: Movie[]; total_pages: number }>(
      `/movies/search?query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.data;
  },

  getDetails: async (id: number): Promise<Movie> => {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  getTrailer: async (id: number): Promise<{ key: string }> => {
    const response = await api.get<{ key: string }>(`/movies/${id}/trailer`);
    return response.data;
  },
};

export const reviews = {
  create: async (data: ReviewFormData): Promise<Review> => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
  },

  getMovieReviews: async (movieId: number): Promise<Review[]> => {
    const response = await api.get<Review[]>(`/reviews/movie/${movieId}`);
    return response.data;
  },

  getUserReviews: async (): Promise<Review[]> => {
    const response = await api.get<Review[]>('/reviews/user');
    return response.data;
  },

  update: async (reviewId: string, data: UpdateReviewData): Promise<Review> => {
    const response = await api.put<Review>(`/reviews/${reviewId}`, data);
    return response.data;
  },

  delete: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};

export default api; 