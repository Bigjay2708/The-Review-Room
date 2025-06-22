import express, { Request, Response } from 'express';
import { Movie } from '../models/movie.model';

const router = express.Router();

// Get all movies
router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular movies - this needs to come BEFORE the /:id route
router.get('/popular', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;    // For now, return all movies since we don't have popularity data
    // In a real app, you'd sort by popularity score or view count
    const movies = await Movie.find().limit(20 * page).skip((page - 1) * 20);
    res.json({ results: movies });
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
    
    if (!searchQuery) {
      return res.status(400).json({ message: 'Search query is required' });
    }    // Create a regex search for title (case-insensitive)
    const movies = await Movie.find({
      title: { $regex: searchQuery, $options: 'i' }
    }).limit(20 * Number(page)).skip((Number(page) - 1) * 20);
    
    res.json({ results: movies });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID
router.get('/:id', async (req: Request, res: Response) => {  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
