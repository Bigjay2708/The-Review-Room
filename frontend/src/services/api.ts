import axios from 'axios';
import { Movie, User, AuthResponse } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://the-review-room.onrender.com/api'
  : 'http://localhost:5000/api';

const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;

export const fetchPopularMovies = async (page: number): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
      params: { page },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page: number): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/search`, {
      params: { query, page },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const fetchMovieDetails = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ${id}:`, error);
    throw error;
  }
};

// --- Authentication API Calls ---

export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, { username, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
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

export default axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
}); 