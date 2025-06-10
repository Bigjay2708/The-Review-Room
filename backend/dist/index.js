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
const movie_routes_1 = require("./routes/movie.routes");
const review_routes_1 = require("./routes/review.routes");
const user_routes_1 = require("./routes/user.routes");
console.log('--- BACKEND INDEX.TS INITIALIZING ---');
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '..', '.env') });
console.log('TMDB_API_KEY from process.env:', process.env.TMDB_API_KEY);
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);
console.log('MONGODB_URI from process.env:', process.env.MONGODB_URI);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/movies', movie_routes_1.movieRoutes);
app.use('/api/reviews', review_routes_1.reviewRoutes);
app.use('/api/users', user_routes_1.userRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/review-room')
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
