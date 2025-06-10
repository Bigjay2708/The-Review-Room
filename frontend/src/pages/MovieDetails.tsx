import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Rating,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { movies, reviews } from '../services/api';
import { Movie, Review } from '../types';
import { useAuth } from '../hooks/useAuth';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieReviews, setMovieReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    content: '',
  });
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieResponse, reviewsResponse] = await Promise.all([
          movies.getDetails(Number(id)),
          reviews.getMovieReviews(Number(id)),
        ]);
        setMovie(movieResponse);
        setMovieReviews(reviewsResponse);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.rating || !reviewForm.content) {
      setReviewError('Please provide both rating and review content');
      return;
    }

    try {
      const response = await reviews.create({
        movieId: Number(id),
        ...reviewForm,
      });
      setMovieReviews([response, ...movieReviews]);
      setReviewForm({ rating: 0, content: '' });
      setReviewError('');
    } catch (err: any) {
      setReviewError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error || 'Movie not found'}</Alert>
      </Box>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {movie.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {new Date(movie.release_date).toLocaleDateString()}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={movie.vote_average / 2} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({movie.vote_average.toFixed(1)})
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {movie.overview}
          </Typography>
          {movie.genres && (
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                Genres:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {movie.genres.map((genre) => (
                  <Chip
                    key={genre.id}
                    label={genre.name}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>

      {user && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Write a Review
          </Typography>
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleReviewSubmit}>
              <Box mb={2}>
                <Rating
                  value={reviewForm.rating}
                  onChange={(_, value) =>
                    setReviewForm({ ...reviewForm, rating: value || 0 })
                  }
                />
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Review"
                value={reviewForm.content}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, content: e.target.value })
                }
                error={!!reviewError}
                helperText={reviewError}
              />
              <Box mt={2}>
                <Button type="submit" variant="contained">
                  Submit Review
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      )}

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Reviews
        </Typography>
        {movieReviews.length === 0 ? (
          <Typography color="text.secondary">No reviews yet</Typography>
        ) : (
          movieReviews.map((review) => (
            <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="subtitle1" sx={{ mr: 1 }}>
                  {review.user?.username}
                </Typography>
                <Rating value={review.rating} readOnly size="small" />
              </Box>
              <Typography variant="body1">{review.content}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Container>
  );
};

export default MovieDetails; 