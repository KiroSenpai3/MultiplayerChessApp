const gameService = require('../services/game/gameService');
const logger = require('../utils/logger');

module.exports = function registerGameHandlers(io, socket) {
  /**
   * Client joins game room (e.g. after reload or page navigation)
   */
  socket.on('game:join_room', (data = {}) => {
    const { gameId } = data;
    if (!gameId) return;

    socket.join(`game:${gameId}`);
    const gameState = gameService.getGame(gameId);

    if (gameState) {
      socket.emit('game:state', { state: gameState });
    } else {
      socket.emit('game:error', { message: 'Active game not found' });
    }
  });

  /**
   * Client submits chess move
   */
  socket.on('game:move', async (data = {}) => {
    try {
      const { gameId, userId, move } = data;

      if (!gameId || !move) {
        socket.emit('game:error', { message: 'Invalid move payload' });
        return;
      }

      const moveResult = await gameService.makeMove({
        gameId,
        socketId: socket.id,
        userId: userId || socket.id,
        move,
      });

      if (!moveResult.valid) {
        socket.emit('game:error', { message: moveResult.error || 'Invalid move' });
        return;
      }

      // Broadcast valid move and updated game state to all clients in room
      io.to(`game:${gameId}`).emit('game:move', {
        move: moveResult.move,
        state: moveResult.state,
      });

      // If game reached checkmate/draw, broadcast game completion event
      if (moveResult.state.isGameOver) {
        io.to(`game:${gameId}`).emit('game:ended', {
          state: moveResult.state,
          reason: moveResult.state.result.reason,
          winner: moveResult.state.result.winner,
          message:
            moveResult.state.result.winner === 'draw'
              ? `Game ended in a draw (${moveResult.state.result.reason.replace('_', ' ')})`
              : `${moveResult.state.result.winner.toUpperCase()} won by ${moveResult.state.result.reason}!`,
        });
      }
    } catch (err) {
      logger.error(`Error processing move for socket ${socket.id}`, { error: err.message });
      socket.emit('game:error', { message: 'Error processing move' });
    }
  });

  /**
   * Client resigns game
   */
  socket.on('game:resign', async (data = {}) => {
    try {
      const { gameId, userId } = data;
      if (!gameId) return;

      const res = await gameService.resignGame({
        gameId,
        socketId: socket.id,
        userId: userId || socket.id,
      });

      if (!res.success) {
        socket.emit('game:error', { message: res.error || 'Resignation failed' });
        return;
      }

      io.to(`game:${gameId}`).emit('game:ended', {
        state: res.state,
        reason: 'resignation',
        winner: res.state.result.winner,
        message: `${res.resigningColor.toUpperCase()} resigned. ${res.state.result.winner.toUpperCase()} wins!`,
      });
    } catch (err) {
      logger.error(`Error processing resignation for socket ${socket.id}`, { error: err.message });
    }
  });

  /**
   * Client offers draw
   */
  socket.on('game:draw_offer', (data = {}) => {
    const { gameId, userId } = data;
    if (!gameId) return;

    const res = gameService.offerDraw({ gameId, userId: userId || socket.id });
    if (res.success) {
      socket.to(`game:${gameId}`).emit('game:draw_offered', {
        offeredBy: res.offeredBy,
      });
    } else {
      socket.emit('game:error', { message: res.error || 'Could not offer draw' });
    }
  });

  /**
   * Client responds to draw offer
   */
  socket.on('game:draw_respond', async (data = {}) => {
    const { gameId, userId, accept } = data;
    if (!gameId) return;

    const res = await gameService.respondDraw({
      gameId,
      userId: userId || socket.id,
      accept,
    });

    if (!res.success) {
      socket.emit('game:error', { message: res.error || 'Invalid draw response' });
      return;
    }

    if (res.accepted) {
      io.to(`game:${gameId}`).emit('game:ended', {
        state: res.state,
        reason: 'draw_agreement',
        winner: 'draw',
        message: 'Game ended by mutual agreement (Draw).',
      });
    } else {
      io.to(`game:${gameId}`).emit('game:draw_declined', {
        message: 'Draw offer was declined.',
      });
    }
  });

  /**
   * Client requests game state reconnection
   */
  socket.on('game:reconnect', (data = {}) => {
    const { gameId, userId } = data;
    if (!gameId || !userId) return;

    const res = gameService.reconnectPlayer({
      gameId,
      userId,
      newSocketId: socket.id,
      io,
    });

    if (res.success) {
      socket.join(`game:${gameId}`);
      socket.emit('game:state', { state: res.state, userColor: res.userColor });
    } else {
      socket.emit('game:error', { message: res.error || 'Reconnection failed' });
    }
  });
};
