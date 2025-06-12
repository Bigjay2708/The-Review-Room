import React from 'react';
import { Button, Box, Typography, Divider } from '@mui/material';
import { Google as GoogleIcon, GitHub as GitHubIcon } from '@mui/icons-material';

interface SocialLoginButtonsProps {
  onGoogleLogin: () => void;
  onGithubLogin: () => void;
  isLoading: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onGithubLogin,
  isLoading,
}) => {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={onGoogleLogin}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            py: 1,
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Continue with Google
        </Button>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GitHubIcon />}
          onClick={onGithubLogin}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            py: 1,
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Continue with GitHub
        </Button>
      </Box>
    </Box>
  );
};

export default SocialLoginButtons; 