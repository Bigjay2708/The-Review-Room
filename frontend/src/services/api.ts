import axios from 'axios';
import { Movie } from '../types';

const API_URL = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  : 'https://the-review-room-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

export default api; 