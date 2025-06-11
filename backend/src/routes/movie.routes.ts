import express, { Request, Response } from 'express';
import axios from 'axios';
import asyncHandler from 'express-async-handler';

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get popular movies
router.get('/popular', asyncHandler(async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const response = await axios.get(
    `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
  );
  res.json(response.data);
}));

// Search movies
router.get('/search', asyncHandler(async (req: Request, res: Response) => {
  const { query, page = 1 } = req.query;
  const response = await axios.get(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=${page}`
  );
  res.json(response.data);
}));

// Get movie details
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const response = await axios.get(
    `${TMDB_BASE_URL}/movie/${req.params.id}?api_key=${TMDB_API_KEY}`
  );
  res.json(response.data);
}));

// Get movie trailer
router.get('/:id/trailer', asyncHandler(async (req: Request, res: Response) => {
  const response = await axios.get(
    `${TMDB_BASE_URL}/movie/${req.params.id}/videos?api_key=${TMDB_API_KEY}`
  );
  const trailer = response.data.results.find(
    (video: any) => video.type === 'Trailer'
  );
  res.json({ key: trailer?.key });
}));

export const movieRoutes = router; 