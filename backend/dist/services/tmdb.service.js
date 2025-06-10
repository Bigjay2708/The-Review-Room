"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tmdbService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger")); // Import the logger utility
const BASE_URL = 'https://api.themoviedb.org/3';
const tmdbService = {
    fetchPopularMovies: async (page) => {
        try {
            const response = await axios_1.default.get(`${BASE_URL}/movie/popular`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: 'en-US',
                    page,
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Error fetching popular movies:', error);
            throw error;
        }
    },
    searchMovies: async (query, page) => {
        try {
            const response = await axios_1.default.get(`${BASE_URL}/search/movie`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: 'en-US',
                    query,
                    page,
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error('Error searching movies:', error);
            throw error;
        }
    },
    fetchMovieDetails: async (movieId) => {
        try {
            const response = await axios_1.default.get(`${BASE_URL}/movie/${movieId}`, {
                params: {
                    api_key: process.env.TMDB_API_KEY,
                    language: 'en-US',
                },
            });
            return response.data;
        }
        catch (error) {
            logger_1.default.error(`Error fetching details for movie ID ${movieId}:`, error);
            throw error;
        }
    },
};
exports.tmdbService = tmdbService;
