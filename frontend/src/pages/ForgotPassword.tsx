import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
  Typography,
} from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import { requestPasswordReset } from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check Your Email">
        <Box sx={{ textAlign: 'center' }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset instructions have been sent to your email.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please check your email for instructions to reset your password.
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
          >
            Return to Login
          </Button>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Send Reset Instructions'}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Back to Login
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPassword; 