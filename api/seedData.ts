import { Movie } from './models/movie.model';

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
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

export const seedMoviesFromTMDB = async (pages: number = 3) => {
  try {
    // Check if movies already exist
    const existingMovies = await Movie.find();
    if (existingMovies.length > 0) {
      console.log('Movies already exist in database. Skipping seed.');
      return;
    }

    console.log('Fetching movies from TMDB...');
    let allMovies: TMDBMovie[] = [];

    // Fetch multiple pages of popular movies
    for (let page = 1; page <= pages; page++) {
      const movies = await fetchMoviesFromTMDB(page);
      allMovies = [...allMovies, ...movies];
      
      // Add a small delay to respect API rate limits
      if (page < pages) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }    // Transform TMDB data to our movie schema, filtering out movies with missing required fields
    const moviesForDB = allMovies
      .filter(movie => movie.title && movie.overview && movie.release_date) // Filter out incomplete data
      .map(movie => ({
        title: movie.title,
        overview: movie.overview || 'No overview available', // Provide fallback
        release_date: movie.release_date,
        poster_path: movie.poster_path,
        tmdb_id: movie.id,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        popularity: movie.popularity
      }));

    // Insert movies into database
    await Movie.insertMany(moviesForDB);
    console.log(`Successfully seeded ${moviesForDB.length} movies from TMDB`);
  } catch (error) {
    console.error('Error seeding movies from TMDB:', error);
    
    // Fallback: if TMDB fails, we can still provide some basic functionality
    console.log('TMDB seeding failed. Database will remain empty until movies are added manually.');
  }
};

// Legacy function name for compatibility
export const seedMovies = seedMoviesFromTMDB;
