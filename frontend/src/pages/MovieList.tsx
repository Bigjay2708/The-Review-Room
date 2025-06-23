import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Pagination,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { fetchPopularMovies, fetchTopRatedMovies, fetchNowPlayingMovies, fetchUpcomingMovies, searchMovies } from '../services/api';
import { Movie } from '../types';
import Grid from '@mui/material/Grid';

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [category, setCategory] = useState(0); // 0: Popular, 1: Top Rated, 2: Now Playing, 3: Upcoming

  const categories = [
    { label: 'Popular', fetch: fetchPopularMovies },
    { label: 'Top Rated', fetch: fetchTopRatedMovies },
    { label: 'Now Playing', fetch: fetchNowPlayingMovies },
    { label: 'Upcoming', fetch: fetchUpcomingMovies },
  ];  useEffect(() => {
    console.log('MovieList mounted or deps changed. Page:', page, 'Category:', category);
    fetchMovies();
    // eslint-disable-next-line
  }, [page, category]);
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await categories[category].fetch(page);
      
      console.log('API Response:', response);
      
      // Check if response and results exist before updating state
      if (response && response.results) {
        setMovieList(response.results);
        setTotalPages(response.total_pages || 1);
        setTotalResults(response.total_results || 0);
      } else {
        console.error('Invalid API response format:', response);
        setError('Received invalid data from API');
        // Set empty movie list to prevent map errors
        setMovieList([]);
      }
    } catch (err: any) {
      console.error('Error in fetchMovies:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch movies');
      // Set empty movie list to prevent map errors
      setMovieList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchMovies();
      return;
    }
    try {
      setLoading(true);
      const response = await searchMovies(searchQuery, 1);
      setMovieList(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
      setPage(1);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to search movies');
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryChange = (_: React.SyntheticEvent, newValue: number) => {
    setCategory(newValue);
    setPage(1);
    setSearchQuery(''); // Clear search when changing category
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading && !movieList.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error && !movieList.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  return (
    <Container>      {/* Header with movie count from TMDB */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Movie Database
        </Typography>
        {totalResults > 0 && (
          <Chip 
            label={`${totalResults.toLocaleString()} movies available from TMDB`} 
            color="primary" 
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={category} onChange={handleCategoryChange} aria-label="movie categories">
          {categories.map((cat, index) => (
            <Tab key={index} label={cat.label} />
          ))}
        </Tabs>
      </Box>

      {/* Search Box */}
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>      <Grid container spacing={3}>
        {movieList && movieList.length > 0 ? (
          movieList.map((movie) => (
            <Grid key={movie.id} style={{ flexBasis: '25%', maxWidth: '25%' }}>
              <Card
                sx={{
                  height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <CardMedia
                component="img"
                height="400"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {movie.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 1,
                    height: '3.6em'
                  }}
                >
                  {movie.overview}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(movie.release_date).toLocaleDateString()}
                </Typography>              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', mt: 3, mb: 3 }}>
            <Typography variant="h6">
              {error ? `Error: ${error}` : "No movies found"}
            </Typography>
          </Box>
        </Grid>
      )}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default MovieList;