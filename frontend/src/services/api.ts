import axios from 'axios';
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
  async (error: any) => {
    const originalRequest = error.config as any & { _retry?: boolean };
    
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

export const fetchPopularMovies = async (page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    console.log(`Fetching popular movies with page=${page}`);
    const response = await api.get<{ results: Movie[]; total_results: number; page: number; total_pages: number }>(`/movies/popular`, {
      params: { page },
    });
    console.log('Popular movies API response:', response);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching popular movies:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
      // Fallback data to prevent blank screen
    return {
      results: [
        {
          id: 999,
          title: "API Error - Fallback Movie",
          overview: "This is a fallback movie shown when the API request fails. Please check the console for error details.",
          poster_path: "/sample_poster.jpg",
          backdrop_path: "/sample_backdrop.jpg",
          release_date: "2025-01-01",
          vote_average: 0,
          adult: false,
          genre_ids: [28],
          original_language: "en",
          original_title: "API Error - Fallback Movie",
          popularity: 0,
          video: false,
          vote_count: 0,
          runtime: 0,
          tagline: "API Error"
        }
      ],
      page: 1,
      total_pages: 1,
      total_results: 1
    };
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
): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
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
    const response = await api.get<{ results: Movie[]; total_results: number; page: number; total_pages: number }>(`/movies/search`, {
      params,
    });
    return response.data;
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

// Add new API functions for different movie categories
export const fetchTopRatedMovies = async (page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    const response = await api.get<{ results: Movie[]; total_results: number; page: number; total_pages: number }>(`/movies/top-rated`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const fetchNowPlayingMovies = async (page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    const response = await api.get<{ results: Movie[]; total_results: number; page: number; total_pages: number }>(`/movies/now-playing`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

export const fetchUpcomingMovies = async (page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    const response = await api.get<{ results: Movie[]; total_results: number; page: number; total_pages: number }>(`/movies/upcoming`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const discoverMovies = async (
  page: number = 1,
  filters?: {
    sortBy?: string;
    genre?: string;
    year?: string;
    minRating?: string;
    maxRating?: string;
  }
): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    const params: any = { page };
    if (filters) {
      if (filters.sortBy) params.sort_by = filters.sortBy;
      if (filters.genre) params.genre = filters.genre;
      if (filters.year) params.year = filters.year;
      if (filters.minRating) params.min_rating = filters.minRating;
      if (filters.maxRating) params.max_rating = filters.maxRating;
    }
    const response = await api.get<{ results: Movie[]; total_results: number; page: number; total_pages: number }>(`/movies/discover`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error discovering movies:', error);
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