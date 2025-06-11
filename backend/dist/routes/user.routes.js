"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const user_model_1 = require("../models/user.model");
const auth_middleware_1 = require("../middleware/auth.middleware");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const router = express_1.default.Router();
// Register a new user
router.post('/register', rateLimit_middleware_1.authLimiter, [
    (0, express_validator_1.check)('username', 'Username is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
], (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { username, email, password } = req.body;
    // Check if email already exists
    let user = await user_model_1.User.findOne({ email });
    if (user) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
    }
    // Check if username already exists
    user = await user_model_1.User.findOne({ username });
    if (user) {
        res.status(400).json({ message: 'User with this username already exists' });
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 8);
    user = new user_model_1.User({ username, email, password: hashedPassword });
    await user.save();
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User registered successfully', token });
}));
// Login user
router.post('/login', rateLimit_middleware_1.authLimiter, [
    (0, express_validator_1.check)('identifier', 'Please provide a valid email or username').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').exists(),
], (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { identifier, password } = req.body;
    // Find user by email or username
    const user = await user_model_1.User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
    });
    if (!user) {
        res.status(400).json({ message: 'Invalid login credentials' });
        return;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        res.status(400).json({ message: 'Invalid login credentials' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
        message: 'Logged in successfully',
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
}));
// Get user profile
router.get('/profile', auth_middleware_1.auth, (0, express_async_handler_1.default)(async (req, res) => {
    res.json(req.user);
}));
exports.userRoutes = router;
