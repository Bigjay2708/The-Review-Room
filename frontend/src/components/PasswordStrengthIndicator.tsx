import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[a-z]/.test(password)) strength += 25; // Lowercase
    if (/[0-9]/.test(password)) strength += 25; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special characters
    
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 25) return '#ff1744'; // Red
    if (strength < 50) return '#ff9100'; // Orange
    if (strength < 75) return '#ffd600'; // Yellow
    return '#00c853'; // Green
  };

  const getStrengthText = (strength: number): string => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Moderate';
    return 'Strong';
  };

  const strength = calculateStrength(password);
  const color = getStrengthColor(strength);
  const text = getStrengthText(strength);

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: 0.5,
          color: color,
          fontWeight: 'medium',
        }}
      >
        Password Strength: {text}
      </Typography>
    </Box>
  );
};

export default PasswordStrengthIndicator; 