const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(`API Error on ${req.method} ${req.url}: ${err.message}`, {
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
