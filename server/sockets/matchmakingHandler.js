const matchmakingService = require('../services/matchmaking/matchmakingService');
const gameService = require('../services/game/gameService');
const logger = require('../utils/logger');

module.exports = function registerMatchmakingHandlers(io, socket) {
  /**
   * Client joins matchmaking queue
   */
  socket.on('matchmaking:join', async (data = {}) => {
    try {
      const userId = data.userId || socket.id;
      const username = data.username || `Player_${socket.id.substring(0, 4)}`;

      const result = await matchmakingService.addToQueue({
        socketId: socket.id,
        userId,
        username,
      });

      if (result.status === 'already_queued') {
        socket.emit('game:error', { message: 'You are already searching for a match.' });
        return;
      }

      socket.emit('matchmaking:queued', {
        message: 'Searching for an opponent...',
        socketId: socket.id,
      });

      // If a pair was found, launch game room & notify both sockets
      if (result.match) {
        await handleMatchFound(io, result.match);
      }
    } catch (err) {
      logger.error(`Error in matchmaking:join for socket ${socket.id}`, { error: err.message });
      socket.emit('game:error', { message: 'Matchmaking error occurred' });
    }
  });

  /**
   * Client cancels matchmaking
   */
  socket.on('matchmaking:cancel', async () => {
    try {
      const res = await matchmakingService.removeFromQueue(socket.id);
      if (res.status === 'cancelled') {
        socket.emit('matchmaking:cancelled', { message: 'Matchmaking cancelled.' });
      }
    } catch (err) {
      logger.error(`Error in matchmaking:cancel for socket ${socket.id}`, { error: err.message });
    }
  });
};

/**
 * Handles initialization when two players are matched
 */
async function handleMatchFound(io, match) {
  const { gameId, whitePlayer, blackPlayer } = match;

  // Initialize authoritative game state
  const gameState = await gameService.createGame({
    gameId,
    whitePlayer,
    blackPlayer,
  });

  const roomName = `game:${gameId}`;

  // Get Socket instances for both players
  const whiteSocket = io.sockets.sockets.get(whitePlayer.socketId);
  const blackSocket = io.sockets.sockets.get(blackPlayer.socketId);

  if (whiteSocket) whiteSocket.join(roomName);
  if (blackSocket) blackSocket.join(roomName);

  // Notify white player
  if (whiteSocket) {
    whiteSocket.emit('matchmaking:found', {
      gameId,
      color: 'white',
      opponent: { username: blackPlayer.username, id: blackPlayer.userId },
    });
  }

  // Notify black player
  if (blackSocket) {
    blackSocket.emit('matchmaking:found', {
      gameId,
      color: 'black',
      opponent: { username: whitePlayer.username, id: whitePlayer.userId },
    });
  }

  // Broadcast initial game start payload to room
  io.to(roomName).emit('game:started', {
    gameId,
    state: gameState,
  });
}
