// app/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // add timestamp
    winston.format.printf(
      info => `${info.timestamp} [${info.level.toUpperCase()}] ${info.message}` // custom log format
    )
  ),
  transports: [
    new winston.transports.Console(), // logs to console
    new winston.transports.File({ filename: 'security.log' }) // logs to file
  ]
});

module.exports = logger;