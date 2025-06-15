import express, { Request, Response } from 'express';
import axios from 'axios';
import asyncHandler from 'express-async-handler';
import logger from '../utils/logger';

const router = express.Router();
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper to get and validate TMDB_API_KEY
const getTmdbApiKey = (): string => {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error('TMDB_API_KEY is not defined in environment variables.');
  }
  return key;
};

// Get popular movies
router.get('/popular', asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const tmdbApiKey = getTmdbApiKey(); // Get and validate key here
  const tmdbUrl = TMDB_BASE_URL + '/movie/popular?api_key=' + tmdbApiKey + '&page=' + page;
  logger.info('Fetching popular movies from TMDB URL:', tmdbUrl);
  try {
    const response = await axios.get(tmdbUrl);
    logger.info('TMDB response structure:', {
      hasResults: 'results' in response.data,
      resultsType: response.data.results ? typeof response.data.results : 'undefined',
      resultsLength: response.data.results ? response.data.results.length : 0,
      firstResult: response.data.results ? response.data.results[0] : null
    });
    logger.info('TMDB popular movies response status:', response.status);
    logger.info('TMDB popular movies response data (first 500 chars):', JSON.stringify(response.data).substring(0, 500));
    res.json(response.data);
  } catch (error: any) {
    logger.error('Error fetching popular movies from TMDB:', error.message);
    if (error.response) {
      logger.error('TMDB response error data:', error.response.data);
      logger.error('TMDB response error status:', error.response.status);
      logger.error('TMDB response error headers:', error.response.headers);
    }
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch popular movies from external API',
      error: error.message,
      details: error.response?.data,
    });
  }
}));

// Search movies with advanced filters
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { query, page = 1, genre, year, minRating, maxRating, language, sortBy } = req.query;
  const tmdbApiKey = getTmdbApiKey();
  let url = TMDB_BASE_URL + '/search/movie?api_key=' + tmdbApiKey + '&query=' + query + '&page=' + page;
  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&year=${year}`;
  if (language) url += `&language=${language}`;
  if (sortBy) url += `&sort_by=${sortBy}`;
  // Note: TMDB does not support min/max rating directly in search, but you can filter results after fetching
  const response = await axios.get(url);
  let results = response.data.results;
  if (minRating) results = results.filter((m: any) => m.vote_average >= Number(minRating));
  if (maxRating) results = results.filter((m: any) => m.vote_average <= Number(maxRating));
  res.json({ ...response.data, results });
}));

// Get movie details
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const tmdbApiKey = getTmdbApiKey(); // Get and validate key here
  const response = await axios.get(
    TMDB_BASE_URL + '/movie/' + req.params.id + '?api_key=' + tmdbApiKey
  );
  res.json(response.data);
}));

// Get movie trailer
router.get('/:id/trailer', asyncHandler(async (req: Request, res: Response) => {
  const tmdbApiKey = getTmdbApiKey(); // Get and validate key here
  const response = await axios.get(
    TMDB_BASE_URL + '/movie/' + req.params.id + '/videos?api_key=' + tmdbApiKey
  );
  const trailer = response.data.results.find(
    (video: any) => video.type === 'Trailer'
  );
  res.json({ key: trailer?.key });
}));

export const movieRoutes = router;