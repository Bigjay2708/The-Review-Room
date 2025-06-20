import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import dbConnect from './dbConnect';

// Load environment variables
config();

const app: Application = express();
const port: number = parseInt(process.env.PORT || '5000', 10);

// Connect to MongoDB
dbConnect().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Import routes
const usersRouter = require('./users/users.routes');
const moviesRouter = require('./movies/movies.routes');
const reviewsRouter = require('./reviews/reviews.routes');

// Use routes
app.use('/api/users', usersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/reviews', reviewsRouter);

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
