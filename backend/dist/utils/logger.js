"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.errors({ stack: true }), // Log the stack trace for errors
    winston_1.format.splat(), winston_1.format.json() // Output logs as JSON
    ),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple() // Use simple format for console output (colorized)
            )
        })
        // In a production environment, you might add file transports or other transports here
        // new transports.File({ filename: 'error.log', level: 'error' }),
        // new transports.File({ filename: 'combined.log' })
    ],
    exitOnError: false, // Do not exit on handled exceptions
});
// If we're not in production, log to the console with simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
    }));
}
exports.default = logger;
