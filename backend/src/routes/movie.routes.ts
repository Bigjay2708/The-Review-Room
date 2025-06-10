import express from 'express';
import { tmdbService } from '../services/tmdb.service';
import { auth } from '../middleware/auth.middleware';
import logger from '../utils/logger';
import asyncHandler from 'express-async-handler';

const router = express.Router();

// Get popular movies
router.get('/popular', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const movies = await tmdbService.fetchPopularMovies(page);
  res.json(movies);
}));

// Search movies
router.get('/search', asyncHandler(async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  if (!query) {
    res.status(400).json({ error: 'Search query is required' });
    return;
  }
  const movies = await tmdbService.searchMovies(query as string, page);
  res.json(movies);
}));

// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
  let movieId: number | undefined;
  movieId = parseInt(req.params.id);
  if (isNaN(movieId)) {
    res.status(400).json({ error: 'Invalid movie ID' });
    return;
  }
  const movie = await tmdbService.fetchMovieDetails(movieId);
  res.json(movie);
}));

export { router as movieRoutes }; 