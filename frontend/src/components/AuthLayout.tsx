import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import { Movie as MovieIcon } from '@mui/icons-material';

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <MovieIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography component="h1" variant="h4">
            The Review Room
          </Typography>
        </Box>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            {title}
          </Typography>
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout; 