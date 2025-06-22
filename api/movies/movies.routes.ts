import express, { Request, Response } from 'express';
import TMDBService from '../services/tmdb.service';

const router = express.Router();
const tmdbService = new TMDBService();

// Get popular movies directly from TMDB
router.get('/popular', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    
    const tmdbResponse = await tmdbService.getPopularMovies(page);
    
    res.json(tmdbResponse);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
});

// Get top rated movies directly from TMDB
router.get('/top-rated', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    
    const tmdbResponse = await tmdbService.getTopRatedMovies(page);
    
    res.json(tmdbResponse);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    res.status(500).json({ message: 'Failed to fetch top rated movies' });
  }
});

// Get now playing movies directly from TMDB
router.get('/now-playing', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    
    const tmdbResponse = await tmdbService.getNowPlayingMovies(page);
    
    res.json(tmdbResponse);
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    res.status(500).json({ message: 'Failed to fetch now playing movies' });
  }
});

// Get upcoming movies directly from TMDB
router.get('/upcoming', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    
    const tmdbResponse = await tmdbService.getUpcomingMovies(page);
    
    res.json(tmdbResponse);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming movies' });
  }
});

// Discover movies with filters directly from TMDB
router.get('/discover', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const sortBy = req.query.sort_by as string;
    const genre = req.query.genre as string;
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const minRating = req.query.min_rating ? parseFloat(req.query.min_rating as string) : undefined;
    const maxRating = req.query.max_rating ? parseFloat(req.query.max_rating as string) : undefined;
    
    const tmdbResponse = await tmdbService.discoverMovies(page, {
      sortBy,
      genre,
      year,
      minRating,
      maxRating
    });
    
    res.json(tmdbResponse);
  } catch (error) {
    console.error('Error discovering movies:', error);
    res.status(500).json({ message: 'Failed to discover movies' });
  }
});

// Search movies directly from TMDB
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;
    const searchQuery = query as string;
    
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const tmdbResponse = await tmdbService.searchMovies(searchQuery, Number(page));
    
    res.json(tmdbResponse);
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
});

// Get all movies (default to popular)
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    
    // Default to popular movies for the main movies endpoint
    const tmdbResponse = await tmdbService.getPopularMovies(page);
    
    res.json({
      movies: tmdbResponse.results,
      currentPage: tmdbResponse.page,
      totalPages: tmdbResponse.total_pages,
      totalMovies: tmdbResponse.total_results,
      hasMore: tmdbResponse.page < tmdbResponse.total_pages
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch movies' });
  }
});

// Get movie by ID with full details directly from TMDB
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movieId = parseInt(req.params.id);
    
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    const movieDetails = await tmdbService.getMovieDetails(movieId);
    
    res.json(movieDetails);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    if (error.message === 'Movie not found') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
});

export default router;
