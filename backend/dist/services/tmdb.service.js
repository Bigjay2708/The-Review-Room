"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovieTrailer = exports.getMovieDetails = exports.searchMovies = exports.getPopularMovies = void 0;
const axios_1 = __importDefault(require("axios"));
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const tmdbApi = axios_1.default.create({
    baseURL: TMDB_BASE_URL,
});
const getTmdbApiKey = () => {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
        throw new Error('TMDB_API_KEY is not defined. Please set it in your .env file.');
    }
    return apiKey;
};
const getPopularMovies = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1) {
    try {
        const response = yield tmdbApi.get('/movie/popular', {
            params: {
                api_key: getTmdbApiKey(),
                language: 'en-US',
                page,
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Failed to fetch popular movies: ${error.message}`);
    }
});
exports.getPopularMovies = getPopularMovies;
const searchMovies = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, page = 1) {
    try {
        const response = yield tmdbApi.get('/search/movie', {
            params: {
                api_key: getTmdbApiKey(),
                language: 'en-US',
                query,
                page,
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Failed to search movies: ${error.message}`);
    }
});
exports.searchMovies = searchMovies;
const getMovieDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield tmdbApi.get(`/movie/${id}`, {
            params: {
                api_key: getTmdbApiKey(),
                language: 'en-US',
            },
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Failed to get movie details: ${error.message}`);
    }
});
exports.getMovieDetails = getMovieDetails;
const getMovieTrailer = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield tmdbApi.get(`/movie/${id}/videos`, {
            params: {
                api_key: getTmdbApiKey(),
                language: 'en-US',
            },
        });
        // Find the official YouTube trailer
        const trailer = response.data.results.find((video) => video.site === 'YouTube' && video.type === 'Trailer');
        return trailer ? { key: trailer.key } : null;
    }
    catch (error) {
        throw new Error(`Failed to get movie trailer: ${error.message}`);
    }
});
exports.getMovieTrailer = getMovieTrailer;
