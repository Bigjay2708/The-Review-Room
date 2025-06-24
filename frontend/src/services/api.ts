import axios from 'axios';
import { Movie, User, AuthResponse } from '../types';

// Use environment variable with fallback
// For production deployed on Vercel, we need to handle API URLs differently
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? '/api'  // Use relative path in production (handled by Vercel rewrites)
  : process.env.REACT_APP_API_BASE_URL || '/api'; 

// For debugging - log the API base URL
console.log(`API Base URL: ${API_BASE_URL}, isProduction: ${isProduction}`);

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

// Add response interceptor to handle errors and validate response format
api.interceptors.response.use(
  (response) => {
    // Log all successful responses for debugging
    console.log(`API Response [${response.config.url}]:`, {
      status: response.status,
      contentType: response.headers['content-type'],
      data: response.data
    });
    
    // Check if the response is valid
    // Accept any JSON response that has a data property
    // Don't do strict validation here
    if (response.data) {
      return response;
    } else {
      console.error('Empty API response:', response);
      return Promise.reject(new Error('Empty API response'));
    }
  },
  async (error: any) => {
    const originalRequest = error.config as any & { _retry?: boolean };
    
    console.error('API error interceptor:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      contentType: error.response?.headers?.['content-type']
    });
    
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
    console.log(`Fetching popular movies with page=${page} from ${api.defaults.baseURL}/movies/popular`);
    
    // Try direct API call first to debug
    try {
      const directResponse = await fetch(`${window.location.origin}/api/movies/popular?page=${page}`);
      console.log('Direct fetch response:', await directResponse.clone().text());
    } catch (e) {
      console.error('Direct fetch failed:', e);
    }
    
    // Use the axios instance for the actual request
    const response = await api.get(`/movies/popular`, {
      params: { page },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Popular movies API response:', response);
    
    // More flexible validation - check for data and try to adapt if structure isn't exact
    if (!response.data) {
      throw new Error('Empty API response');
    }
    
    // If we get data but no results array, try to adapt
    if (!response.data.results) {
      console.warn('API response missing results array, attempting to adapt:', response.data);
      
      // If we have a direct array, use it
      if (Array.isArray(response.data)) {
        return {
          results: response.data,
          page: 1,
          total_pages: 1, 
          total_results: response.data.length
        };
      }
      
      // If we have an object with movie-like properties, wrap it
      if (response.data.id && response.data.title) {
        return {
          results: [response.data],
          page: 1,
          total_pages: 1,
          total_results: 1
        };
      }
    }
    
    // Ensure results is always an array
    if (response.data.results && !Array.isArray(response.data.results)) {
      response.data.results = [response.data.results];
    }
    
    return {
      results: response.data.results || [],
      page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_results: response.data.total_results || (response.data.results ? response.data.results.length : 0)
    };
  } catch (error: any) {
    console.error('Error fetching popular movies:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
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
    console.log(`Fetching top rated movies with page=${page}`);
    const response = await api.get(`/movies/top_rated`, {
      params: { page },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Top rated movies API response:', response);
    
    // More flexible validation - check for data and try to adapt if structure isn't exact
    if (!response.data) {
      throw new Error('Empty API response');
    }
    
    // If we get data but no results array, try to adapt
    if (!response.data.results) {
      console.warn('API response missing results array, attempting to adapt:', response.data);
      
      // If we have a direct array, use it
      if (Array.isArray(response.data)) {
        return {
          results: response.data,
          page: 1,
          total_pages: 1, 
          total_results: response.data.length
        };
      }
      
      // If we have an object with movie-like properties, wrap it
      if (response.data.id && response.data.title) {
        return {
          results: [response.data],
          page: 1,
          total_pages: 1,
          total_results: 1
        };
      }
    }
    
    // Ensure results is always an array
    if (response.data.results && !Array.isArray(response.data.results)) {
      response.data.results = [response.data.results];
    }
    
    return {
      results: response.data.results || [],
      page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_results: response.data.total_results || (response.data.results ? response.data.results.length : 0)
    };
  } catch (error: any) {
    console.error('Error fetching top rated movies:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Fallback data to prevent blank screen
    return {
      results: [
        {
          id: 998,
          title: "API Error - Fallback Top Rated Movie",
          overview: "This is a fallback movie shown when the API request fails. Please check the console for error details.",
          poster_path: "/sample_poster.jpg",
          backdrop_path: "/sample_backdrop.jpg",
          release_date: "2025-01-01",
          vote_average: 0,
          adult: false,
          genre_ids: [28],
          original_language: "en",
          original_title: "API Error - Fallback Top Rated Movie",
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

export const fetchNowPlayingMovies = async (page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    console.log(`Fetching now playing movies with page=${page}`);
    const response = await api.get(`/movies/now_playing`, {
      params: { page },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Now playing movies API response:', response);
    
    // More flexible validation - check for data and try to adapt if structure isn't exact
    if (!response.data) {
      throw new Error('Empty API response');
    }
    
    // If we get data but no results array, try to adapt
    if (!response.data.results) {
      console.warn('API response missing results array, attempting to adapt:', response.data);
      
      // If we have a direct array, use it
      if (Array.isArray(response.data)) {
        return {
          results: response.data,
          page: 1,
          total_pages: 1, 
          total_results: response.data.length
        };
      }
      
      // If we have an object with movie-like properties, wrap it
      if (response.data.id && response.data.title) {
        return {
          results: [response.data],
          page: 1,
          total_pages: 1,
          total_results: 1
        };
      }
    }
    
    // Ensure results is always an array
    if (response.data.results && !Array.isArray(response.data.results)) {
      response.data.results = [response.data.results];
    }
    
    return {
      results: response.data.results || [],
      page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_results: response.data.total_results || (response.data.results ? response.data.results.length : 0)
    };
  } catch (error: any) {
    console.error('Error fetching now playing movies:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Fallback data to prevent blank screen
    return {
      results: [
        {
          id: 997,
          title: "API Error - Fallback Now Playing Movie",
          overview: "This is a fallback movie shown when the API request fails. Please check the console for error details.",
          poster_path: "/sample_poster.jpg",
          backdrop_path: "/sample_backdrop.jpg",
          release_date: "2025-01-01",
          vote_average: 0,
          adult: false,
          genre_ids: [28],
          original_language: "en",
          original_title: "API Error - Fallback Now Playing Movie",
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

export const fetchUpcomingMovies = async (page: number = 1): Promise<{ results: Movie[]; total_pages: number; total_results: number; page: number }> => {
  try {
    console.log(`Fetching upcoming movies with page=${page}`);
    const response = await api.get(`/movies/upcoming`, {
      params: { page },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Upcoming movies API response:', response);
    
    // More flexible validation - check for data and try to adapt if structure isn't exact
    if (!response.data) {
      throw new Error('Empty API response');
    }
    
    // If we get data but no results array, try to adapt
    if (!response.data.results) {
      console.warn('API response missing results array, attempting to adapt:', response.data);
      
      // If we have a direct array, use it
      if (Array.isArray(response.data)) {
        return {
          results: response.data,
          page: 1,
          total_pages: 1, 
          total_results: response.data.length
        };
      }
      
      // If we have an object with movie-like properties, wrap it
      if (response.data.id && response.data.title) {
        return {
          results: [response.data],
          page: 1,
          total_pages: 1,
          total_results: 1
        };
      }
    }
    
    // Ensure results is always an array
    if (response.data.results && !Array.isArray(response.data.results)) {
      response.data.results = [response.data.results];
    }
    
    return {
      results: response.data.results || [],
      page: response.data.page || 1,
      total_pages: response.data.total_pages || 1,
      total_results: response.data.total_results || (response.data.results ? response.data.results.length : 0)
    };
  } catch (error: any) {
    console.error('Error fetching upcoming movies:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Fallback data to prevent blank screen
    return {
      results: [
        {
          id: 996,
          title: "API Error - Fallback Upcoming Movie",
          overview: "This is a fallback movie shown when the API request fails. Please check the console for error details.",
          poster_path: "/sample_poster.jpg",
          backdrop_path: "/sample_backdrop.jpg",
          release_date: "2025-01-01",
          vote_average: 0,
          adult: false,
          genre_ids: [28],
          original_language: "en",
          original_title: "API Error - Fallback Upcoming Movie",
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