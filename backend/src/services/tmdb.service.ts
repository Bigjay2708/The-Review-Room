import axios from 'axios';
import logger from '../utils/logger'; // Import the logger utility

const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbService = {
  fetchPopularMovies: async (page: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
          page,
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  searchMovies: async (query: string, page: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
          query,
          page,
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Error searching movies:', error);
      throw error;
    }
  },

  fetchMovieDetails: async (movieId: number) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: 'en-US',
        },
      });
      return response.data;
    } catch (error) {
      logger.error(`Error fetching details for movie ID ${movieId}:`, error);
      throw error;
    }
  },
};

export { tmdbService }; 