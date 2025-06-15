import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Rating, Alert } from '@mui/material';
import { ReviewFormData } from '../types';

interface ReviewFormProps {
  movieId: number;
  onReviewSubmit: (review: ReviewFormData) => Promise<void>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onReviewSubmit }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!rating || !comment.trim()) {
      setError('Please provide a rating and a comment.');
      return;
    }
    setLoading(true);
    try {
      await onReviewSubmit({ movieId, rating, comment });
      setSuccess(true);
      setComment('');
      setRating(null);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Write a Review</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Review submitted!</Alert>}
      <Rating
        name="rating"
        value={rating}
        onChange={(_, value) => setRating(value)}
        size="large"
        sx={{ mb: 2 }}
      />
      <TextField
        label="Comment"
        multiline
        minRows={3}
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </Box>
  );
};

export default ReviewForm;
