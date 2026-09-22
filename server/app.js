const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const apiRoutes = require('./routes/apiRoutes');
const apiLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware setup
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api', apiLimiter, apiRoutes);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
