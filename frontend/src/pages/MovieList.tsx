import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Pagination,
  Rating,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { movies } from '../services/api';
import { Movie } from '../types';

const MovieList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movies.getPopular(page);
      setMovieList(response.results);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch movies');
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
      const response = await movies.search(searchQuery, 1);
      setMovieList(response.results);
      setTotalPages(response.total_pages);
      setPage(1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search movies');
    } finally {
      setLoading(false);
    }
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container>
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
      </Box>

      <Grid container spacing={3}>
        {movieList.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
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
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {movie.title}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating
                    value={movie.vote_average / 2}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({movie.vote_average.toFixed(1)})
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {new Date(movie.release_date).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
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