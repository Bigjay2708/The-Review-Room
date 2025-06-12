import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Movie as MovieIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleMovies = () => {
    handleMenuClose();
    navigate('/movies');
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login'); // Redirect to login page after logout
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMovies}>
        <MovieIcon sx={{ mr: 1 }} />
        Movies
      </MenuItem>
      {!user ? (
        <>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>Login</MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/register'); }}>Register</MenuItem>
        </>
      ) : (
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      )}
    </Menu>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          The Review Room
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            {renderMobileMenu}
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/movies"
              startIcon={<MovieIcon />}
            >
              Movies
            </Button>
            {!user ? (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 