import axios from 'axios';
import { Movie, User, AuthResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { TMDB_API_KEY };

export const fetchPopularMovies = async (page: number): Promise<Movie[]> => {
  try {
    const response = await axios.get<{ results: Movie[] }>(`${API_BASE_URL}/movies/popular`, {
      params: { page },
    });
    return (response.data as { results: Movie[] }).results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page: number,
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
    const response = await axios.get<{ results: Movie[] }>(`${API_BASE_URL}/movies/search`, {
      params,
    });
    return (response.data as { results: Movie[] }).results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get<Movie>(`${API_BASE_URL}/movies/${id}`);
    return response.data as Movie;
  } catch (error) {
    console.error(`Error fetching movie details for ${id}:`, error);
    throw error;
  }
};

// --- Authentication API Calls ---

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/register`, { username, email, password });
    return response.data as AuthResponse;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, { email, password });
    return response.data as AuthResponse;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await axios.get<User>(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data as User;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, data: { username: string; email: string }) => {
  const response = await axios.put<User>(`${API_BASE_URL}/users/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as User;
};

// --- Password Reset API Calls ---
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/users/forgot-password`, { email });
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/users/reset-password`, { token, newPassword });
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

// --- Email Verification API Calls ---
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/users/verify-email`, { token });
  } catch (error) {
    console.error('Email verification error:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/users/resend-verification`);
  } catch (error) {
    console.error('Resend verification email error:', error);
    throw error;
  }
};

export default api;