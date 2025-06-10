import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to The Review Room
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover, review, and discuss your favorite movies with our community.
          Get access to detailed movie information, trailers, and user reviews.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/movies')}
            sx={{ mr: 2 }}
          >
            Browse Movies
          </Button>
          {!isAuthenticated && (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Join Now
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 