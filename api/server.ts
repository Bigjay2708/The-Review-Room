import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import dbConnect from './dbConnect';
import { seedMovies } from './seedData';

// Load environment variables
config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000', 10);

// Ensure JWT secret is set
if (!process.env.JWT_SECRET) {
  console.error('CRITICAL: JWT_SECRET environment variable is not set');
  process.exit(1);
}

// Enhanced MongoDB connection with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  let currentTry = 0;
  while (currentTry < retries) {    try {
      await dbConnect();
      console.log('MongoDB connected successfully');
      
      // Note: Seeding is done manually via npm scripts
      // No automatic seeding to avoid connection conflicts
      
      return;
    } catch (err) {
      currentTry++;
      console.error(`Failed to connect to MongoDB (attempt ${currentTry}/${retries}):`, err);
      if (currentTry === retries) {
        console.error('Maximum retries reached, exiting application');
        process.exit(1);
      }
      console.log(`Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

connectWithRetry();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Response compression
app.use(express.json({ limit: '10mb' })); // Increased payload limit with proper size restriction
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routes
import usersRouter from './users/users.routes';
import moviesRouter from './movies/movies.routes';
import reviewsRouter from './reviews/reviews.routes';

// Use routes with consistent API paths
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/reviews', reviewsRouter);

// Simple public test endpoint
app.get('/test', (req: Request, res: Response) => {
  res.json({ message: 'Public endpoint working', timestamp: new Date().toISOString() });
});

// Health check route - Git deployment test
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    deployment: 'git-connected'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Enhanced error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  // Return appropriate error message based on environment
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(500).json({ 
    message: 'Internal server error',
    error: isDev ? err.message : undefined,
    stack: isDev ? err.stack : undefined
  });
});

// Only start the server directly if not being imported by Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the Express app for Vercel
export default app;
