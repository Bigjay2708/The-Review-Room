import express, { Request, Response } from 'express';
import { Movie } from '../models/movie.model';

const router = express.Router();

// Get all movies with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .sort({ popularity: -1 }) // Sort by popularity
      .skip(skip)
      .limit(limit);

    const total = await Movie.countDocuments();
    
    res.json({
      movies,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total,
      hasMore: skip + movies.length < total
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular movies - this needs to come BEFORE the /:id route
router.get('/popular', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const movies = await Movie.find()
      .sort({ popularity: -1, vote_average: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ 
      results: movies,
      page,
      total_results: await Movie.countDocuments()
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search movies
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query, page = 1 } = req.query;
    const searchQuery = query as string;
    const limit = 20;
    const skip = (Number(page) - 1) * limit;
    
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create a regex search for title (case-insensitive)
    const movies = await Movie.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { overview: { $regex: searchQuery, $options: 'i' } },
        { original_title: { $regex: searchQuery, $options: 'i' } }
      ]
    })
    .sort({ popularity: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Movie.countDocuments({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { overview: { $regex: searchQuery, $options: 'i' } },
        { original_title: { $regex: searchQuery, $options: 'i' } }
      ]
    });
    
    res.json({ 
      results: movies,
      page: Number(page),
      total_results: total
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID with full details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    // You could also fetch additional details from TMDB here if needed
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid movie ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
