"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_model_1 = require("../models/review.model");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = express_1.default.Router();
// Create a review
router.post('/', auth_middleware_1.auth, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const { movieId, rating, content } = req.body;
    const review = new review_model_1.Review({
        movieId,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        rating,
        content,
    });
    await review.save();
    res.status(201).json(review);
}));
// Get reviews for a movie
router.get('/movie/:movieId', (0, express_async_handler_1.default)(async (req, res) => {
    const movieId = parseInt(req.params.movieId);
    const reviews = await review_model_1.Review.find({ movieId })
        .populate('userId', 'username')
        .sort({ createdAt: -1 });
    res.json(reviews);
}));
// Get user's reviews
router.get('/user', auth_middleware_1.auth, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const reviews = await review_model_1.Review.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
        .sort({ createdAt: -1 });
    res.json(reviews);
}));
// Update a review
router.patch('/:id', auth_middleware_1.auth, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const review = await review_model_1.Review.findOne({
        _id: req.params.id,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    });
    if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    const updates = Object.keys(req.body);
    updates.forEach((update) => {
        review[update] = req.body[update];
    });
    await review.save();
    res.json(review);
}));
// Delete a review
router.delete('/:id', auth_middleware_1.auth, (0, express_async_handler_1.default)(async (req, res) => {
    var _a;
    const review = await review_model_1.Review.findOneAndDelete({
        _id: req.params.id,
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
    });
    if (!review) {
        res.status(404).json({ error: 'Review not found' });
        return;
    }
    res.json(review);
}));
exports.reviewRoutes = router;
