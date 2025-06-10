"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_model_1 = require("../models/review.model");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Create a review
router.post('/', auth_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { movieId, rating, content } = req.body;
        const review = new review_model_1.Review({
            movieId,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            rating,
            content,
        });
        yield review.save();
        res.status(201).json(review);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Get reviews for a movie
router.get('/movie/:movieId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieId = parseInt(req.params.movieId);
        const reviews = yield review_model_1.Review.find({ movieId })
            .populate('userId', 'username')
            .sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Get user's reviews
router.get('/user', auth_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const reviews = yield review_model_1.Review.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
            .sort({ createdAt: -1 });
        res.json(reviews);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Update a review
router.patch('/:id', auth_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const review = yield review_model_1.Review.findOne({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        const updates = Object.keys(req.body);
        updates.forEach((update) => {
            review[update] = req.body[update];
        });
        yield review.save();
        res.json(review);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Delete a review
router.delete('/:id', auth_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const review = yield review_model_1.Review.findOneAndDelete({
            _id: req.params.id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.json(review);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.reviewRoutes = router;
