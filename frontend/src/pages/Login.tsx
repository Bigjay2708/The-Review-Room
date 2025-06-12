import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../components/AuthLayout';
import SocialLoginButtons from '../components/SocialLoginButtons';

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithGithub, error: authError, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rememberMe' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      navigate('/');
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Initialize Google OAuth
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
        scope: 'email profile',
        callback: async (response: any) => {
          if (response.access_token) {
            await loginWithGoogle(response.access_token);
            navigate('/');
          }
        },
      });
      client.requestAccessToken();
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const handleGithubLogin = async () => {
    try {
      // Redirect to GitHub OAuth
      const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const scope = 'user:email';
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    } catch (err) {
      console.error('Github login failed:', err);
    }
  };

  return (
    <AuthLayout title="Welcome Back">
      <form onSubmit={handleSubmit}>
        {authError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {authError}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                color="primary"
              />
            }
            label="Remember me"
          />
          <Button
            color="primary"
            onClick={() => navigate('/forgot-password')}
            sx={{ textTransform: 'none' }}
          >
            Forgot password?
          </Button>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        <SocialLoginButtons
          onGoogleLogin={handleGoogleLogin}
          onGithubLogin={handleGithubLogin}
          isLoading={isLoading}
        />

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Button
              color="primary"
              onClick={() => navigate('/register')}
              sx={{ textTransform: 'none' }}
            >
              Sign Up
            </Button>
          </Typography>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default Login; 