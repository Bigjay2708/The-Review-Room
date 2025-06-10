# The Review Room

A modern movie review platform built with the MERN stack, featuring movie information from TMDb and YouTube trailers.

## Features

- Browse movies with details from TMDb
- Read and write movie reviews
- Watch movie trailers via YouTube
- Rate and comment on movies
- User authentication and profiles

## Tech Stack

- MongoDB: Database
- Express.js: Backend API
- React: Frontend UI
- Node.js: Runtime
- TypeScript: Type safety
- TMDb API: Movie data
- YouTube Data API: Trailers

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- TMDb API key
- YouTube Data API key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server
PORT=5000
MONGODB_URI=your_mongodb_uri

# TMDb API
TMDB_API_KEY=your_tmdb_api_key
TMDB_API_BASE_URL=https://api.themoviedb.org/3

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

# JWT
JWT_SECRET=your_jwt_secret
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

4. Open http://localhost:3000 in your browser

## Project Structure

```
the-review-room/
├── backend/           # Express.js backend
├── frontend/         # React frontend
└── README.md
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Attribution

- Movie data provided by TMDb
- Trailers provided by YouTube 