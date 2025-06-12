import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const GithubCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGithub } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGithubCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setError('GitHub authentication failed');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      try {
        await loginWithGithub(code);
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to authenticate with GitHub');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleGithubCallback();
  }, [searchParams, loginWithGithub, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <CircularProgress />
          <Alert severity="info">Completing GitHub authentication...</Alert>
        </>
      )}
    </Box>
  );
};

export default GithubCallback; 