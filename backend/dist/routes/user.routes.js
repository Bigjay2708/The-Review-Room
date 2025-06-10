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
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Register a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const user = new user_model_1.User({ username, email, password });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Login user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new Error('Invalid login credentials');
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid login credentials');
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}));
// Get user profile
router.get('/profile', auth_middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(req.user);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
exports.userRoutes = router;
