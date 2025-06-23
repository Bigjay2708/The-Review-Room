// Simple Express API for Vercel deployment
const express = require('express');
const cors = require('cors');
const app = express();

// Parse JSON
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['https://the-review-room.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Default movies endpoint
app.get('/api/movies', (req, res) => {
  res.json({
    results: [
      {
        id: 123,
        title: "Sample Movie",
        overview: "This is a sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster.jpg",
        backdrop_path: "/sample_backdrop.jpg",
        release_date: "2025-01-01",
        vote_average: 8.5
      }
    ],
    page: 1,
    total_pages: 1,
    total_results: 1
  });
});

// Popular movies endpoint
app.get('/api/movies/popular', (req, res) => {
  res.json({
    results: [
      {
        id: 123,
        title: "Popular Sample Movie",
        overview: "This is a popular sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster.jpg",
        backdrop_path: "/sample_backdrop.jpg",
        release_date: "2025-01-01",
        vote_average: 8.5
      },
      {
        id: 124,
        title: "Another Popular Movie",
        overview: "Another popular movie description.",
        poster_path: "/sample_poster2.jpg",
        backdrop_path: "/sample_backdrop2.jpg",
        release_date: "2025-02-01",
        vote_average: 7.5
      }
    ],
    page: 1,
    total_pages: 1,
    total_results: 2
  });
});

// Top rated movies endpoint
app.get('/api/movies/top_rated', (req, res) => {
  res.json({
    results: [
      {
        id: 125,
        title: "Top Rated Sample Movie",
        overview: "This is a top rated sample movie to confirm the API is working properly.",
        poster_path: "/sample_poster3.jpg",
        backdrop_path: "/sample_backdrop3.jpg",
        release_date: "2025-03-01",
        vote_average: 9.5
      }
    ],
    page: 1,
    total_pages: 1,
    total_results: 1
  });
});

// Movie details endpoint
app.get('/api/movies/:id', (req, res) => {
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Set port
const port = process.env.PORT || 3000;

// Only start server if running directly (not when imported by Vercel)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;
