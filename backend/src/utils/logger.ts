import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }), // Log the stack trace for errors
    format.splat(),
    format.json() // Output logs as JSON
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple() // Use simple format for console output (colorized)
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
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

export default logger; 