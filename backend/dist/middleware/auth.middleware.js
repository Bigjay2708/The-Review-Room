"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const auth = async (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No authentication token, authorization denied.' });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.User.findOne({ _id: verified.id });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
};
exports.auth = auth;
