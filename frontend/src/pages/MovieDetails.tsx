import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  CardMedia,
  Chip,
} from '@mui/material';
import { fetchMovieDetails } from '../services/api';
import { Movie } from '../types';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const movieDetails = await fetchMovieDetails(parseInt(id));
        setMovie(movieDetails);
      } catch (err) {
        setError('Failed to fetch movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container>
        <Typography>Movie not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {movie.poster_path && (
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', md: 300 }, borderRadius: 2, flexShrink: 0 }}
            image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        )}
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {movie.title}
          </Typography>
          {movie.tagline && (
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {movie.tagline}
            </Typography>
          )}
          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>
          <Box sx={{ my: 2 }}>
            {movie.genres?.map((genre) => (
              <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
          <Typography variant="body2" color="text.secondary">
            Release Date: {movie.release_date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Runtime: {movie.runtime} minutes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rating: {movie.vote_average?.toFixed(1)} / 10
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default MovieDetails;