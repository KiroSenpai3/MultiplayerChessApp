const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const env = require('./config/env');
const { connectDB } = require('./config/db');
const { initRedis } = require('./config/redis');
const initSocketServer = require('./sockets');
const logger = require('./utils/logger');

const server = http.createServer(app);

// Socket.IO Server configuration
const io = new Server(server, {
  cors: {
    origin: env.clientUrl,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

async function startServer() {
  try {
    // 1. Initialize MongoDB Database
    await connectDB();

    // 2. Initialize Redis Client
    await initRedis();

    // 3. Register Socket.IO handlers
    initSocketServer(io);

    // 4. Start HTTP Server
    server.listen(env.port, () => {
      logger.info(`=================================================`);
      logger.info(` MultChess Server Listening on Port: ${env.port}`);
      logger.info(` Environment: ${env.nodeEnv}`);
      logger.info(` Client CORS URL: ${env.clientUrl}`);
      logger.info(`=================================================`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

startServer();
