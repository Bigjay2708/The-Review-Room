// Simple Express API for Vercel deployment
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://the-review-room.vercel.app,http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple movies endpoint that returns a sample movie
app.get('/api/movies', (req, res) => {
  res.json({
    movies: [
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
