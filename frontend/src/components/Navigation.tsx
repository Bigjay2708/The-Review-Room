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
  AccountCircle,
  Movie as MovieIcon,
  RateReview as ReviewIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMobileMenuAnchor(null);
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleMyReviews = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleMovies = () => {
    handleMenuClose();
    navigate('/movies');
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
      {user && (
        <MenuItem onClick={handleMyReviews}>
          <ReviewIcon sx={{ mr: 1 }} />
          My Reviews
        </MenuItem>
      )}
    </Menu>
  );

  const renderUserMenu = (
    <Menu
      anchorEl={userMenuAnchor}
      open={Boolean(userMenuAnchor)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
            {user ? (
              <>
                <Button
                  color="inherit"
                  component={RouterLink}
                  to="/profile"
                  startIcon={<ReviewIcon />}
                >
                  My Reviews
                </Button>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="account"
                  onClick={handleUserMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                {renderUserMenu}
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={RouterLink} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation; 