// api.js - Vercel Serverless API Handler
const express = require('express');
const cors = require('cors');
const app = express();

// Logging middleware to debug request handling
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url}`);
  next();
});

// Parse JSON
app.use(express.json());

// Enable CORS - more permissive version
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add additional headers to all responses
app.use((req, res, next) => {
  // Set the Content-Type header for all responses
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    headers: req.headers,
    path: req.path,
    originalUrl: req.originalUrl || req.url
  });
});

// Debug endpoint to help diagnose routing issues
app.get('/debug', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    request: {
      method: req.method,
      url: req.url,
      originalUrl: req.originalUrl,
      path: req.path,
      query: req.query,
      headers: req.headers
    },
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_URL: process.env.VERCEL_URL
    }
  });
});

// Popular movies endpoint
app.get('/movies/popular', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  console.log(`Serving popular movies for page ${page}`);
  
  // Return sample data that matches the Movie type in the frontend
  res.json({
    results: [
      {
        id: 123,
        title: "Popular Sample Movie",
        overview: "This is a popular sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster.jpg",
        backdrop_path: "/sample_backdrop.jpg",
        release_date: "2025-01-01",
        vote_average: 8.5,
        adult: false,
        genre_ids: [28, 12],
        original_language: "en",
        original_title: "Popular Sample Movie",
        popularity: 10.5,
        video: false,
        vote_count: 100,
        runtime: 120,
        tagline: "A sample movie"
      },
      {
        id: 124,
        title: "Another Popular Movie",
        overview: "Another popular movie description.",
        poster_path: "/sample_poster2.jpg",
        backdrop_path: "/sample_backdrop2.jpg",
        release_date: "2025-02-01",
        vote_average: 7.5,
        adult: false,
        genre_ids: [35, 18],
        original_language: "en",
        original_title: "Another Popular Movie",
        popularity: 8.5,
        video: false,
        vote_count: 80,
        runtime: 110,
        tagline: "Another sample movie"
      }
    ],
    page: page,
    total_pages: 10,
    total_results: 100
  });
});

// Top rated movies endpoint
app.get('/movies/top_rated', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  console.log(`Serving top rated movies for page ${page}`);
  
  res.json({
    results: [
      {
        id: 125,
        title: "Top Rated Sample Movie",
        overview: "This is a top rated sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster3.jpg",
        backdrop_path: "/sample_backdrop3.jpg",
        release_date: "2025-03-01",
        vote_average: 9.5,
        adult: false,
        genre_ids: [28, 12],
        original_language: "en",
        original_title: "Top Rated Sample Movie",
        popularity: 10.5,
        video: false,
        vote_count: 100,
        runtime: 120,
        tagline: "A sample movie"
      }
    ],
    page: page,
    total_pages: 5,
    total_results: 50
  });
});

// Now playing movies endpoint
app.get('/movies/now_playing', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  console.log(`Serving now playing movies for page ${page}`);
  
  res.json({
    results: [
      {
        id: 126,
        title: "Now Playing Sample Movie",
        overview: "This is a now playing sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster4.jpg",
        backdrop_path: "/sample_backdrop4.jpg",
        release_date: "2025-04-01",
        vote_average: 7.8,
        adult: false,
        genre_ids: [28, 12],
        original_language: "en",
        original_title: "Now Playing Sample Movie",
        popularity: 10.5,
        video: false,
        vote_count: 100,
        runtime: 120,
        tagline: "A sample movie"
      }
    ],
    page: page,
    total_pages: 5,
    total_results: 40
  });
});

// Upcoming movies endpoint
app.get('/movies/upcoming', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  
  console.log(`Serving upcoming movies for page ${page}`);
  
  res.json({
    results: [
      {
        id: 127,
        title: "Upcoming Sample Movie",
        overview: "This is an upcoming sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster5.jpg",
        backdrop_path: "/sample_backdrop5.jpg",
        release_date: "2025-05-01",
        vote_average: 0,
        adult: false,
        genre_ids: [28, 12],
        original_language: "en",
        original_title: "Upcoming Sample Movie",
        popularity: 10.5,
        video: false,
        vote_count: 0,
        runtime: 120,
        tagline: "A sample movie"
      }
    ],
    page: page,
    total_pages: 3,
    total_results: 30
  });
});

// Movie details endpoint
app.get('/movies/:id', (req, res) => {
  res.json({
    id: parseInt(req.params.id),
    title: `Movie ${req.params.id}`,
    overview: `This is movie ${req.params.id} to confirm the API is working properly.`,
    poster_path: "/sample_poster.jpg",
    backdrop_path: "/sample_backdrop.jpg",
    release_date: "2025-01-01",
    vote_average: 8.5,
    genres: [{ id: 28, name: "Action" }]
  });
});

// 404 handler for API routes
app.use((req, res) => {
  console.log(`404 Error: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ 
    error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
    timestamp: new Date().toISOString()
  });
});

// Export the handler for Vercel serverless functions
module.exports = (req, res) => {
  // Log requests for debugging
  console.log(`API Request: ${req.method} ${req.url}`);
  
  // Strip /api prefix from URL
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '');
    console.log(`Rewritten URL: ${req.url}`);
  }
  
  // Ensure response headers are set
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  return app(req, res);
};
