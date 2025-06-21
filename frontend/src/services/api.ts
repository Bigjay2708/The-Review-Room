import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Movie, User, AuthResponse } from '../types';

// Use environment variable with fallback, prefixed with /api for consistency
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Get token from storage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 (Unauthorized) and it's not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear tokens on auth failure
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      
      // Redirect to login page if token expired
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// --- Movies API Calls ---

export const fetchPopularMovies = async (page: number = 1): Promise<Movie[]> => {
  try {
    const response = await api.get<{ results: Movie[] }>(`/movies/popular`, {
      params: { page },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page: number = 1,
  filters?: {
    genre?: string;
    year?: string;
    minRating?: string;
    maxRating?: string;
    language?: string;
    sortBy?: string;
  }
): Promise<Movie[]> => {
  try {
    const params: any = { query, page };
    if (filters) {
      if (filters.genre) params.genre = filters.genre;
      if (filters.year) params.year = filters.year;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.maxRating) params.maxRating = filters.maxRating;
      if (filters.language) params.language = filters.language;
      if (filters.sortBy) params.sortBy = filters.sortBy;
    }
    const response = await api.get<{ results: Movie[] }>(`/movies/search`, {
      params,
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await api.get<Movie>(`/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ${id}:`, error);
    throw error;
  }
};

// --- Authentication API Calls ---

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(`/users/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(`/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/profile`);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (data: { username?: string; email?: string }): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/profile`, data);
    return response.data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// --- Password Reset API Calls ---
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post(`/users/forgot-password`, { email });
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api.post(`/users/reset-password`, { token, newPassword });
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// --- Email Verification API Calls ---
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await api.post(`/users/verify-email`, { token });
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (): Promise<void> => {
  try {
    await api.post(`/users/resend-verification`);
  } catch (error) {
    console.error('Resend verification email error:', error);
    throw error;
  }
};

export { api, TMDB_API_KEY };