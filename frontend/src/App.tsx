import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navigation from './components/Navigation';
import MovieList from './pages/MovieList';
import MovieDetails from './pages/MovieDetails';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { AuthProvider } from './hooks/useAuth';
import UserProfile from './pages/UserProfile';
import Debug from './pages/Debug';

// Create a dark theme for the application
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <div style={{ display: 'flex' }}>
            <Container sx={{ mt: 4, mb: 4, width: '100%' }}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<Navigate to="/movies" replace />} />
                <Route path="/movies" element={<MovieList />} />
                
                {/* Public movie details but with protected review features */}
                <Route path="/movies/:id" element={<MovieDetails />} />
                
                {/* Debug route */}
                <Route path="/debug" element={<Debug />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<UserProfile />} />
                </Route>
              </Routes>
            </Container>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
