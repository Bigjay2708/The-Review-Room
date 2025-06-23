import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Button, Box, CircularProgress, Divider, Alert } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const ApiDebugPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [debugData, setDebugData] = useState<any>(null);
  const [moviesData, setMoviesData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Health check response:', response.data);
      setHealthData(response.data);
    } catch (err: any) {
      console.error('Health check error:', err);
      setError(`Health check failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDebug = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/debug`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Debug endpoint response:', response.data);
      setDebugData(response.data);
    } catch (err: any) {
      console.error('Debug endpoint error:', err);
      setError(`Debug endpoint failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Movies endpoint response:', response.data);
      setMoviesData(response.data);
    } catch (err: any) {
      console.error('Movies endpoint error:', err);
      setError(`Movies endpoint failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch health data on initial load
    fetchHealth();
  }, []);

  const formatJson = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        API Debug Page
      </Typography>
      <Typography variant="body1" paragraph>
        This page helps diagnose API connectivity issues
      </Typography>

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button 
          variant="contained" 
          onClick={fetchHealth} 
          disabled={loading}
        >
          Test Health Endpoint
        </Button>
        <Button 
          variant="contained" 
          onClick={fetchDebug} 
          disabled={loading}
        >
          Test Debug Endpoint
        </Button>
        <Button 
          variant="contained" 
          onClick={fetchMovies} 
          disabled={loading}
        >
          Test Movies Endpoint
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {healthData && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Health Endpoint Response
          </Typography>
          <Paper sx={{ p: 2, maxHeight: '300px', overflow: 'auto' }}>
            <pre>{formatJson(healthData)}</pre>
          </Paper>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {debugData && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Debug Endpoint Response
          </Typography>
          <Paper sx={{ p: 2, maxHeight: '300px', overflow: 'auto' }}>
            <pre>{formatJson(debugData)}</pre>
          </Paper>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {moviesData && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Movies Endpoint Response
          </Typography>
          <Paper sx={{ p: 2, maxHeight: '300px', overflow: 'auto' }}>
            <pre>{formatJson(moviesData)}</pre>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ApiDebugPage;
