const Redis = require('ioredis');
const RedisMock = require('ioredis-mock');
const env = require('./env');
const logger = require('../utils/logger');

let redisClient = null;
let isUsingMock = false;

function switchToMock(reason) {
  if (!isUsingMock || !(redisClient instanceof RedisMock)) {
    if (reason) {
      logger.warn(`Redis fallback triggered (${reason}). Using in-memory Redis mock store.`);
    }
    isUsingMock = true;
    redisClient = new RedisMock();
  }
  return redisClient;
}

function createRedisClient() {
  if (redisClient) return redisClient;

  if (process.env.NODE_ENV === 'test') {
    logger.info('Test environment detected. Using RedisMock instance.');
    return switchToMock();
  }

  try {
    const client = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false, // Don't queue commands when connection is closed
      retryStrategy(times) {
        if (times > 1) {
          switchToMock('Max connection retries exceeded');
          return null;
        }
        return 200;
      },
      lazyConnect: true,
    });

    client.on('error', (err) => {
      switchToMock(err.message);
    });

    redisClient = client;
    return redisClient;
  } catch (err) {
    return switchToMock(err.message);
  }
}

async function initRedis() {
  if (isUsingMock) return redisClient;
  const client = createRedisClient();

  if (isUsingMock || client instanceof RedisMock) return redisClient;

  try {
    await client.connect();
    logger.info(`Redis connected successfully to ${env.redisUrl}`);
  } catch (err) {
    try { client.disconnect(); } catch (e) {}
    switchToMock(`Could not connect to Redis daemon at ${env.redisUrl}: ${err.message}`);
  }
  return redisClient;
}

function getRedisClient() {
  if (!redisClient || (isUsingMock && !(redisClient instanceof RedisMock))) {
    return createRedisClient();
  }
  return redisClient;
}

module.exports = { initRedis, getRedisClient, isMock: () => isUsingMock };
