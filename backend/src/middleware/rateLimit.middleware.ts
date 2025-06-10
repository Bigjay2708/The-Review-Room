import rateLimit from 'express-rate-limit';
import logger from '../utils/logger';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    logger.warn(
      `Rate limit exceeded for IP: ${req.ip}. Endpoint: ${req.originalUrl}. Limit: ${options.max} requests in ${options.windowMs / 1000 / 60} minutes.`
    );
    res.status(options.statusCode).send(options.message);
  },
});

// Authentication rate limiter (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login/registration requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
  handler: (req, res, next, options) => {
    logger.warn(
      `Auth rate limit exceeded for IP: ${req.ip}. Endpoint: ${req.originalUrl}. Limit: ${options.max} requests in ${options.windowMs / 1000 / 60} minutes.`
    );
    res.status(options.statusCode).send(options.message);
  },
}); 