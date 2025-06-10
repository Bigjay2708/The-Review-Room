"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.movieRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tmdb_service_1 = require("../services/tmdb.service");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = express_1.default.Router();
exports.movieRoutes = router;
// Get popular movies
router.get('/popular', (0, express_async_handler_1.default)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const movies = await tmdb_service_1.tmdbService.fetchPopularMovies(page);
    res.json(movies);
}));
// Search movies
router.get('/search', (0, express_async_handler_1.default)(async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    if (!query) {
        res.status(400).json({ error: 'Search query is required' });
        return;
    }
    const movies = await tmdb_service_1.tmdbService.searchMovies(query, page);
    res.json(movies);
}));
// Get movie details
router.get('/:id', (0, express_async_handler_1.default)(async (req, res) => {
    let movieId;
    movieId = parseInt(req.params.id);
    if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
    }
    const movie = await tmdb_service_1.tmdbService.fetchMovieDetails(movieId);
    res.json(movie);
}));
