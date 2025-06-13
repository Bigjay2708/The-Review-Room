import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors, { CorsOptions } from 'cors';
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
const allowedOrigins = [
  'http://localhost:3000',
  'https://the-review-room-frontend-6led.onrender.com'
];

const corsOptions: CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    logger.info('CORS check for origin:', origin); // Log the origin for debugging
    // TEMP: Allow all origins for debugging
    callback(null, true);
    // Uncomment below for strict origin checking
    // if (!origin) return callback(null, true);
    // if (allowedOrigins.indexOf(origin) !== -1) {
    //   callback(null, true);
    // } else {
    //   callback(new Error('Not allowed by CORS'));
    // }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

logger.info('CORS_ORIGIN configured to:', allowedOrigins);

// Middleware
app.use(helmet());
app.use(compression());

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes
app.use(express.json());

// Add a test route at the very top to check CORS and deployment
app.get('/ping', (req: Request, res: Response) => {
  logger.info('Ping route hit');
  res.json({ message: 'pong', time: new Date().toISOString() });
});

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

// Add a catch-all error handler at the end to log errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});