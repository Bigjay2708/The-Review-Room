// Debug.tsx - Put this in your frontend/src/pages folder
import React from 'react';
import { useDebugApi } from '../services/DebugApi';
import { Box, Typography, Paper, Container } from '@mui/material';

const Debug: React.FC = () => {
  const { logs } = useDebugApi();

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          API Debug Page
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          This page tests API connectivity and displays errors
        </Typography>
        
        <Paper sx={{ p: 2, my: 2, bgcolor: '#1a1a1a' }}>
          <Typography variant="h6" gutterBottom>API Connection Logs:</Typography>
          {logs.length === 0 ? (
            <Typography>Running tests...</Typography>
          ) : (
            logs.map((log, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  my: 0.5,
                  color: log.includes('Error') ? '#ff6b6b' : '#63ecda'
                }}
              >
                {log}
              </Typography>
            ))
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Debug;
