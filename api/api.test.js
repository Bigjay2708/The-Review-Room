// api.test.js - Simple script to test the API endpoints
const axios = require('axios');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

const testEndpoints = async () => {
  console.log(`Testing API at ${API_URL}`);
  
  try {
    // Test health endpoint
    console.log('\n--- Testing /health endpoint ---');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('Health Status:', healthResponse.status);
    console.log('Response data:', healthResponse.data);
    console.log('Content-Type:', healthResponse.headers['content-type']);
    
    // Test debug endpoint
    console.log('\n--- Testing /debug endpoint ---');
    const debugResponse = await axios.get(`${API_URL}/debug`);
    console.log('Debug Status:', debugResponse.status);
    console.log('Response data:', debugResponse.data);
    console.log('Content-Type:', debugResponse.headers['content-type']);
    
    // Test movies endpoint
    console.log('\n--- Testing /movies/popular endpoint ---');
    const moviesResponse = await axios.get(`${API_URL}/movies/popular`);
    console.log('Movies Status:', moviesResponse.status);
    console.log('Response data (sample):', {
      page: moviesResponse.data.page,
      total_pages: moviesResponse.data.total_pages,
      total_results: moviesResponse.data.total_results,
      results_count: moviesResponse.data.results?.length
    });
    console.log('Content-Type:', moviesResponse.headers['content-type']);
    
    console.log('\n✅ All API tests completed successfully!');
  } catch (error) {
    console.error('\n❌ API Test Failed:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      console.error('Response data:', error.response.data);
    }
  }
};

// Run the tests
testEndpoints();
