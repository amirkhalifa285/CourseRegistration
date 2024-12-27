const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Ensure the logs directory exists
const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Create a write stream for logging to a file
const logStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });

// Define logging formats
const format = ':method :url :status :res[content-length] - :response-time ms';

// Morgan middleware for logging
const logger = morgan(format, {
  stream: logStream, // Write logs to a file
  skip: (req, res) => process.env.NODE_ENV === 'test', // Skip logging during testing
});

const consoleLogger = morgan(format, {
  skip: (req, res) => false, // Log everything to the console
});

module.exports = { logger, consoleLogger };
