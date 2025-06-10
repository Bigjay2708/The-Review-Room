"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("../utils/logger"));
// General API rate limiter
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        logger_1.default.warn(`Rate limit exceeded for IP: ${req.ip}. Endpoint: ${req.originalUrl}. Limit: ${options.max} requests in ${options.windowMs / 1000 / 60} minutes.`);
        res.status(options.statusCode).send(options.message);
    },
});
// Authentication rate limiter (stricter)
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 login/registration requests per windowMs
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        logger_1.default.warn(`Auth rate limit exceeded for IP: ${req.ip}. Endpoint: ${req.originalUrl}. Limit: ${options.max} requests in ${options.windowMs / 1000 / 60} minutes.`);
        res.status(options.statusCode).send(options.message);
    },
});
