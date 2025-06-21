import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  CardMedia,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import { fetchMovieDetails } from '../services/api';
import { Movie } from '../types';
import ReviewForm from '../components/ReviewForm';
import { fetchReviews, submitReview } from '../services/reviewApi';
import { Review, ReviewFormData } from '../types';
import { useAuth } from '../hooks/useAuth';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const getDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const movieDetails = await fetchMovieDetails(parseInt(id));
        setMovie(movieDetails);
        setReviewLoading(true);
        const reviews = await fetchReviews(parseInt(id));
        setReviews(reviews);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch movie details');
        console.error(err);
      } finally {
        setLoading(false);
        setReviewLoading(false);
      }
    };

    getDetails();
  }, [id]);

  const handleReviewSubmit = async (review: ReviewFormData) => {
    try {
      await submitReview(review);
      const updatedReviews = await fetchReviews(Number(id));
      setReviews(updatedReviews);
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    }
  };

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
          <Typography variant="body2" color="text.secondary">Original Title: {movie.original_title}</Typography>
          <Typography variant="body2" color="text.secondary">Original Language: {movie.original_language}</Typography>
          <Typography variant="body2" color="text.secondary">Release Date: {movie.release_date}</Typography>
          <Typography variant="body2" color="text.secondary">Runtime: {movie.runtime} minutes</Typography>
          <Typography variant="body2" color="text.secondary">Popularity: {movie.popularity}</Typography>
          <Typography variant="body2" color="text.secondary">Vote Average: {movie.vote_average?.toFixed(1)} / 10</Typography>
          <Typography variant="body2" color="text.secondary">Vote Count: {movie.vote_count}</Typography>
          <Typography variant="body2" color="text.secondary">Adult: {movie.adult ? 'Yes' : 'No'}</Typography>
          <Typography variant="body2" color="text.secondary">Video: {movie.video ? 'Yes' : 'No'}</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        {isAuthenticated ? (
          <ReviewForm movieId={movie.id} onReviewSubmit={handleReviewSubmit} />
        ) : (
          <Alert 
            severity="info" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" component={Link} to="/login">
                Sign In
              </Button>
            }
          >
            You need to be logged in to post a review.
          </Alert>
        )}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Reviews</Typography>
        {reviewLoading ? (
          <CircularProgress />
        ) : (
          reviews.length === 0 ? (
            <Typography>No reviews yet. Be the first to review!</Typography>
          ) : (
            reviews.map((review) => (
              <Box key={review._id} sx={{ mb: 2, p: 2, border: '1px solid #333', borderRadius: 2 }}>
                <Typography variant="subtitle2">{review.username} - {new Date(review.createdAt).toLocaleString()}</Typography>
                <Typography variant="body2">Rating: {review.rating} / 5</Typography>
                <Typography variant="body1">{review.comment}</Typography>
              </Box>
            ))
          )
        )}
      </Box>
    </Container>
  );
};

export default MovieDetails;

export default MovieDetails;