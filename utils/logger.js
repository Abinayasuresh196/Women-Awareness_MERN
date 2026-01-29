/**
 * Centralized logger utility
 * Uses winston for structured logging
 * Automatically creates logs folder and files if missing
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs folder exists
const logDir = path.join(process.cwd(), 'server', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Ensure log files exist
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

if (!fs.existsSync(errorLogPath)) fs.writeFileSync(errorLogPath, '');
if (!fs.existsSync(combinedLogPath)) fs.writeFileSync(combinedLogPath, '');

const logFormat = format.printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.File({
      filename: errorLogPath,
      level: 'error',
    }),
    new transports.File({
      filename: combinedLogPath,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
