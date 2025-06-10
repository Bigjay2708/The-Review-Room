"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const movie_routes_1 = require("./routes/movie.routes");
const review_routes_1 = require("./routes/review.routes");
const user_routes_1 = require("./routes/user.routes");
const logger_1 = __importDefault(require("./utils/logger"));
const error_middleware_1 = require("./middleware/error.middleware");
// Handle uncaught exception
process.on('uncaughtException', (err) => {
    logger_1.default.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
    process.exit(1); // Exit with a failure code
});
logger_1.default.info('--- BACKEND INDEX.TS INITIALIZING ---');
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '..', '.env') });
logger_1.default.info('TMDB_API_KEY from process.env:', process.env.TMDB_API_KEY);
logger_1.default.info('JWT_SECRET from process.env:', process.env.JWT_SECRET);
logger_1.default.info('MONGODB_URI from process.env:', process.env.MONGODB_URI);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Configure CORS options
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Allow only your frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
// Middleware
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Routes
app.use('/api/movies', movie_routes_1.movieRoutes);
app.use('/api/reviews', review_routes_1.reviewRoutes);
app.use('/api/users', user_routes_1.userRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Error handling middleware
app.use(error_middleware_1.errorHandler);
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/review-room')
    .then(() => {
    logger_1.default.info('Connected to MongoDB');
    const server = app.listen(PORT, () => {
        logger_1.default.info(`Server is running on port ${PORT}`);
    });
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
        logger_1.default.error('UNHANDLED REJECTION! 💥 Shutting down...', reason);
        server.close(() => {
            process.exit(1); // Exit with a failure code after server closes
        });
    });
})
    .catch((error) => {
    logger_1.default.error('MongoDB connection error:', error);
    // For a non-operational error like this, we should still exit the process
    process.exit(1);
});
