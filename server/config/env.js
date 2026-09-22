const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/multchess',
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  reconnectWindowSeconds: parseInt(process.env.RECONNECT_WINDOW_SECONDS || '30', 10),
  matchmakingPollMs: parseInt(process.env.MATCHMAKING_POLL_INTERVAL_MS || '1000', 10),
};
