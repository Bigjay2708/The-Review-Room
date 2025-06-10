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
exports.movieRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tmdb_service_1 = require("../services/tmdb.service");
const router = express_1.default.Router();
// Get popular movies
router.get('/popular', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const movies = yield (0, tmdb_service_1.getPopularMovies)(page);
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Search movies
router.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const movies = yield (0, tmdb_service_1.searchMovies)(query, page);
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Get movie details
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.id);
        const movie = yield (0, tmdb_service_1.getMovieDetails)(movieId);
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Get movie trailer
router.get('/:id/trailer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.id);
        const trailerKey = yield (0, tmdb_service_1.getMovieTrailer)(movieId);
        res.json({ trailerKey });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.movieRoutes = router;
