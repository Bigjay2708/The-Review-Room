import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { movieRoutes } from './routes/movie.routes';
import { reviewRoutes } from './routes/review.routes';
import { userRoutes } from './routes/user.routes';
import logger from './utils/logger';
import { errorHandler } from './middleware/error.middleware';

// Handle uncaught exception
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1); // Exit with a failure code
});

logger.info('--- BACKEND INDEX.TS INITIALIZING ---');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

logger.info('Full process.env:', process.env);

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS options
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Allow only your frontend origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

logger.info('CORS_ORIGIN configured to:', corsOptions.origin);

// Middleware
app.use(helmet());
app.use(compression());

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/review-room')
  .then(() => {
    logger.info('Connected to MongoDB');
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error | any) => {
      logger.error('UNHANDLED REJECTION! 💥 Shutting down...', reason);
      server.close(() => {
        process.exit(1); // Exit with a failure code after server closes
      });
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    // For a non-operational error like this, we should still exit the process
    process.exit(1);
  });