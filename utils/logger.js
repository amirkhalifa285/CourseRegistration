const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const logStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });

const format = ':method :url :status :res[content-length] - :response-time ms';

const logger = morgan(format, {
  stream: logStream, 
  skip: (req, res) => process.env.NODE_ENV === 'test', 
});

const consoleLogger = morgan(format, {
  skip: (req, res) => false, 
});

module.exports = { logger, consoleLogger };
