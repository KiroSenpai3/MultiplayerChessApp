const registerMatchmakingHandlers = require('./matchmakingHandler');
const registerGameHandlers = require('./gameHandler');
const matchmakingService = require('../services/matchmaking/matchmakingService');
const gameService = require('../services/game/gameService');
const logger = require('../utils/logger');

function initSocketServer(io) {
  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Register modular handler sub-modules
    registerMatchmakingHandlers(io, socket);
    registerGameHandlers(io, socket);

    socket.on('disconnect', async (reason) => {
      logger.info(`Client disconnected: ${socket.id} (Reason: ${reason})`);

      // 1. Remove from matchmaking queue if searching
      await matchmakingService.removeFromQueue(socket.id);

      // 2. Trigger active game disconnect & start 30s reconnect grace timer
      gameService.handlePlayerDisconnect({ socketId: socket.id, io });
    });
  });
}

module.exports = initSocketServer;
