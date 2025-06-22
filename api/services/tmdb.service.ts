import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface TMDBMovieDetail extends TMDBMovie {
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  tagline: string;
  status: string;
  production_companies: Array<{ id: number; name: string; logo_path: string | null }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
}

export interface TMDBResponse {
  results: TMDBMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export class TMDBService {
  private apiKey: string;

  constructor() {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB_API_KEY is not configured');
    }
    this.apiKey = TMDB_API_KEY;
  }

  async getPopularMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${this.apiKey}&page=${page}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching popular movies from TMDB:', error);
      throw error;
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${this.apiKey}&page=${page}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching top rated movies from TMDB:', error);
      throw error;
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${this.apiKey}&page=${page}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching now playing movies from TMDB:', error);
      throw error;
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/upcoming?api_key=${this.apiKey}&page=${page}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming movies from TMDB:', error);
      throw error;
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<TMDBResponse> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching movies on TMDB:', error);
      throw error;
    }
  }

  async getMovieDetails(id: number): Promise<TMDBMovieDetail> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${id}?api_key=${this.apiKey}&language=en-US`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Movie not found');
        }
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching movie details for ${id}:`, error);
      throw error;
    }
  }

  async discoverMovies(
    page: number = 1,
    options: {
      sortBy?: string;
      genre?: string;
      year?: number;
      minRating?: number;
      maxRating?: number;
    } = {}
  ): Promise<TMDBResponse> {
    try {
      const params = new URLSearchParams({
        api_key: this.apiKey,
        page: page.toString(),
        language: 'en-US',
      });

      if (options.sortBy) params.append('sort_by', options.sortBy);
      if (options.genre) params.append('with_genres', options.genre);
      if (options.year) params.append('year', options.year.toString());
      if (options.minRating) params.append('vote_average.gte', options.minRating.toString());
      if (options.maxRating) params.append('vote_average.lte', options.maxRating.toString());

      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error discovering movies on TMDB:', error);
      throw error;
    }
  }
}

export default TMDBService;
