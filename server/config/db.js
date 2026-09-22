const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

let mongoMemoryServer = null;

async function connectDB() {
  try {
    // Attempt standard connection to MONGODB_URI
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    logger.info(`MongoDB connected to external cluster/daemon: ${env.mongoUri}`);
  } catch (err) {
    logger.warn(`External MongoDB unavailable (${err.message}). Initializing in-memory Mongo server for demo/testing...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      logger.info(`In-memory MongoDB connected successfully at ${memUri}`);
    } catch (memErr) {
      logger.error('Failed to initialize MongoDB connection or Memory Server', { error: memErr.message });
    }
  }
}

async function closeDB() {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}

module.exports = { connectDB, closeDB };
