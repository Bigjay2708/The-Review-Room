import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Rating,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { reviews } from '../services/api';
import { Review } from '../types';
import { useAuth } from '../hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editDialog, setEditDialog] = useState({
    open: false,
    review: null as Review | null,
    content: '',
    rating: 0,
  });

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const response = await reviews.getUserReviews();
      setUserReviews(response);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditDialog({
      open: true,
      review,
      content: review.content,
      rating: review.rating,
    });
  };

  const handleEditSubmit = async () => {
    if (!editDialog.review) return;

    try {
      const response = await reviews.update(editDialog.review._id, {
        content: editDialog.content,
        rating: editDialog.rating,
      });

      setUserReviews(
        userReviews.map((review) =>
          review._id === editDialog.review?._id ? response : review
        )
      );

      setEditDialog({ ...editDialog, open: false });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update review');
    }
  };

  const handleDeleteClick = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviews.delete(reviewId);
      setUserReviews(userReviews.filter((review) => review._id !== reviewId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="My Reviews" />
          <Tab label="Account Settings" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {userReviews.length === 0 ? (
          <Typography color="text.secondary">You haven't written any reviews yet</Typography>
        ) : (
          userReviews.map((review) => (
            <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6">{review.movie?.title}</Typography>
                <Box>
                  <IconButton onClick={() => handleEditClick(review)} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(review._id)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Rating value={review.rating} readOnly size="small" />
                <Typography variant="caption" color="text.secondary" ml={1}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Typography variant="body1">{review.content}</Typography>
            </Paper>
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Account Settings
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Account settings functionality will be implemented in a future update.
          </Typography>
        </Paper>
      </TabPanel>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ ...editDialog, open: false })}>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Rating
              value={editDialog.rating}
              onChange={(_, value) =>
                setEditDialog({ ...editDialog, rating: value || 0 })
              }
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review"
            value={editDialog.content}
            onChange={(e) =>
              setEditDialog({ ...editDialog, content: e.target.value })
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ ...editDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 