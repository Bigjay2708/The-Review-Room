// DebugApi.ts - Put this in your frontend/src/services folder
import axios from 'axios';
import { useState, useEffect } from 'react';

export function useDebugApi() {
  const [logs, setLogs] = useState<string[]>([]);

  // Test direct API access
  useEffect(() => {
    const testEndpoints = async () => {
      try {
        // Test 1: Direct fetch to API health endpoint
        const healthTest = await fetch('/api/health');
        const healthStatus = await healthTest.text();
        addLog(`API Health Test: ${healthTest.status} ${healthTest.statusText}`);
        addLog(`Response: ${healthStatus.substring(0, 100)}...`);
        
        // Test 2: Direct fetch to movies endpoint
        const moviesTest = await fetch('/api/movies/popular');
        const moviesStatus = await moviesTest.text();
        addLog(`Movies Test: ${moviesTest.status} ${moviesTest.statusText}`);
        addLog(`Response: ${moviesStatus.substring(0, 100)}...`);
        
        // Test 3: Axios get to health endpoint
        try {
          const axiosHealth = await axios.get('/api/health');
          addLog(`Axios Health: Success ${axiosHealth.status}`);
        } catch (err: any) {
          addLog(`Axios Health Error: ${err.message}`);
        }
        
        // Test 4: Axios get to movies endpoint
        try {
          const axiosMovies = await axios.get('/api/movies/popular');
          addLog(`Axios Movies: Success ${axiosMovies.status}`);
        } catch (err: any) {
          addLog(`Axios Movies Error: ${err.message}`);
        }
      } catch (err: any) {
        addLog(`Test Error: ${err.message}`);
      }
    };
    
    testEndpoints();
  }, []);

  function addLog(message: string) {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
    console.log(`DEBUG: ${message}`);
  }

  return { logs };
}
