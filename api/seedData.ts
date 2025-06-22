import mongoose from 'mongoose';
import { Movie } from './models/movie.model';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/thereviewroom';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

interface TMDBMovie {
  id: number;
  title: string;
  overview?: string;
  release_date: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  genre_ids?: number[];
  original_language?: string;
  original_title?: string;
  video?: boolean;
}

interface TMDBResponse {
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMoviesFromTMDB = async (page: number = 1): Promise<TMDBMovie[]> => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is not configured');
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data: TMDBResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error);
    throw error;
  }
};

export const seedMoviesFromTMDB = async (pages: number = 10) => {
  try {
    await connectToDatabase();
    
    // Check if movies already exist
    const existingMovies = await Movie.find();
    if (existingMovies.length > 0) {
      console.log('Movies already exist in database. Skipping seed.');
      return;
    }

    console.log('Fetching movies from TMDB...');
    let allMovies: TMDBMovie[] = [];

    // Fetch multiple pages of popular movies to get a good selection
    for (let page = 1; page <= pages; page++) {
      console.log(`Fetching page ${page} of ${pages}...`);
      const movies = await fetchMoviesFromTMDB(page);
      allMovies = [...allMovies, ...movies];
      
      // Add a small delay to respect API rate limits
      if (page < pages) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }    // Transform TMDB data to our movie schema
    const moviesForDB = allMovies
      .filter(movie => movie.title && movie.release_date && movie.id) // Filter out incomplete data
      .map(movie => ({
        id: movie.id, // Add id field to match frontend expectations
        title: movie.title,
        overview: movie.overview || 'No overview available',
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        tmdb_id: movie.id,
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        popularity: movie.popularity || 0,
        adult: movie.adult || false,
        genre_ids: movie.genre_ids || [],
        original_language: movie.original_language,
        original_title: movie.original_title,
        video: movie.video || false
      }));

    // Remove duplicates based on tmdb_id
    const uniqueMovies = moviesForDB.filter((movie, index, self) => 
      index === self.findIndex(m => m.tmdb_id === movie.tmdb_id)
    );    // Insert movies into database
    await Movie.insertMany(uniqueMovies);
    console.log(`Successfully seeded ${uniqueMovies.length} movies from TMDB`);
  } catch (error) {
    console.error('Error seeding movies from TMDB:', error);
    console.log('TMDB seeding failed. Database will remain empty until movies are added manually.');
  } finally {
    await mongoose.disconnect();
  }
};

// Legacy function name for compatibility
export const seedMovies = seedMoviesFromTMDB;

// Run seeding if this file is executed directly
if (require.main === module) {
  seedMoviesFromTMDB(10).then(() => {
    console.log('Seeding complete');
    process.exit(0);
  }).catch(error => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}
