const { Chess } = require('chess.js');
const { getRedisClient } = require('../../config/redis');
const logger = require('../../utils/logger');
const GameModel = require('../../models/Game');

class GameService {
  constructor() {
    // In-memory active games map for instant access & chess instance storage
    this.activeGames = new Map();
    // Reconnection timers map: key -> gameId_userId
    this.reconnectTimers = new Map();
  }

  get redis() {
    return getRedisClient();
  }

  /**
   * Initializes a new server-authoritative chess game
   */
  async createGame({ gameId, whitePlayer, blackPlayer }) {
    const chess = new Chess();

    const gameState = {
      gameId,
      whitePlayer: {
        id: whitePlayer.userId,
        socketId: whitePlayer.socketId,
        username: whitePlayer.username,
        color: 'white',
        connected: true,
      },
      blackPlayer: {
        id: blackPlayer.userId,
        socketId: blackPlayer.socketId,
        username: blackPlayer.username,
        color: 'black',
        connected: true,
      },
      fen: chess.fen(),
      turn: 'white',
      status: 'active',
      moves: [],
      drawOfferFrom: null,
      startedAt: new Date().toISOString(),
      endedAt: null,
      result: null,
    };

    // Store engine instance & game state
    this.activeGames.set(gameId, { chess, state: gameState });

    // Cache in Redis for multi-server availability / shared state
    await this.redis.set(`game:${gameId}`, JSON.stringify(gameState));

    logger.info(`Game initialized on server. GameId: ${gameId} [White: ${whitePlayer.username}, Black: ${blackPlayer.username}]`);
    return gameState;
  }

  /**
   * Retrieves active game state
   */
  getGame(gameId) {
    const game = this.activeGames.get(gameId);
    return game ? game.state : null;
  }

  /**
   * Authoritatively validates & executes a chess move
   */
  async makeMove({ gameId, socketId, userId, move }) {
    const gameRecord = this.activeGames.get(gameId);
    if (!gameRecord) {
      return { valid: false, error: 'Game not found' };
    }

    const { chess, state } = gameRecord;

    if (state.status !== 'active') {
      return { valid: false, error: 'Game is no longer active' };
    }

    // Determine player color from socket or userId
    let playerColor = null;
    if (state.whitePlayer.id === userId || state.whitePlayer.socketId === socketId) {
      playerColor = 'white';
    } else if (state.blackPlayer.id === userId || state.blackPlayer.socketId === socketId) {
      playerColor = 'black';
    }

    if (!playerColor) {
      return { valid: false, error: 'You are not a player in this game' };
    }

    // Check turn authorization
    const currentTurnColor = state.turn; // 'white' or 'black'
    if (playerColor !== currentTurnColor) {
      return { valid: false, error: `It is not your turn (${currentTurnColor}'s turn)` };
    }

    // Attempt move execution with chess.js
    let moveResult = null;
    try {
      moveResult = chess.move(move);
    } catch (err) {
      return { valid: false, error: 'Invalid move syntax or illegal move' };
    }

    if (!moveResult) {
      return { valid: false, error: 'Illegal move' };
    }

    // Clear any pending draw offers after a move
    state.drawOfferFrom = null;

    // Record executed move
    const moveData = {
      from: moveResult.from,
      to: moveResult.to,
      promotion: moveResult.promotion || null,
      san: moveResult.san,
      color: playerColor,
      fen: chess.fen(),
      timestamp: new Date().toISOString(),
    };

    state.moves.push(moveData);
    state.fen = chess.fen();
    state.turn = chess.turn() === 'w' ? 'white' : 'black';

    // Evaluate Game Over conditions authoritatively
    let gameEnded = false;
    let result = null;

    if (chess.isCheckmate()) {
      gameEnded = true;
      result = {
        winner: playerColor,
        reason: 'checkmate',
      };
    } else if (chess.isStalemate()) {
      gameEnded = true;
      result = { winner: 'draw', reason: 'stalemate' };
    } else if (chess.isThreefoldRepetition()) {
      gameEnded = true;
      result = { winner: 'draw', reason: 'threefold_repetition' };
    } else if (chess.isInsufficientMaterial()) {
      gameEnded = true;
      result = { winner: 'draw', reason: 'insufficient_material' };
    } else if (chess.isDraw()) {
      gameEnded = true;
      result = { winner: 'draw', reason: 'fifty_move_rule' };
    }

    if (gameEnded) {
      state.status = 'completed';
      state.result = result;
      state.endedAt = new Date().toISOString();
      await this.persistCompletedGame(state);
    }

    // Sync state to Redis
    await this.redis.set(`game:${gameId}`, JSON.stringify(state));

    logger.info(`Move executed in ${gameId}: ${moveData.san} by ${playerColor}. Next turn: ${state.turn}`);

    return {
      valid: true,
      move: moveData,
      state: {
        ...state,
        inCheck: chess.inCheck(),
        isGameOver: gameEnded,
      },
    };
  }

  /**
   * Resigns a game on behalf of a player
   */
  async resignGame({ gameId, socketId, userId }) {
    const gameRecord = this.activeGames.get(gameId);
    if (!gameRecord) return { success: false, error: 'Game not found' };

    const { state } = gameRecord;
    if (state.status !== 'active') return { success: false, error: 'Game is not active' };

    const isWhite = state.whitePlayer.id === userId || state.whitePlayer.socketId === socketId;
    const isBlack = state.blackPlayer.id === userId || state.blackPlayer.socketId === socketId;

    if (!isWhite && !isBlack) return { success: false, error: 'Not a player' };

    const resigningColor = isWhite ? 'white' : 'black';
    const winningColor = isWhite ? 'black' : 'white';

    state.status = 'completed';
    state.result = {
      winner: winningColor,
      reason: 'resignation',
    };
    state.endedAt = new Date().toISOString();

    await this.persistCompletedGame(state);
    await this.redis.set(`game:${gameId}`, JSON.stringify(state));

    logger.info(`Game ${gameId} ended by resignation from ${resigningColor}. Winner: ${winningColor}`);
    return { success: true, state, resigningColor };
  }

  /**
   * Offers a draw to opponent
   */
  offerDraw({ gameId, userId }) {
    const gameRecord = this.activeGames.get(gameId);
    if (!gameRecord) return { success: false, error: 'Game not found' };

    const { state } = gameRecord;
    if (state.status !== 'active') return { success: false, error: 'Game not active' };

    const isWhite = state.whitePlayer.id === userId;
    const isBlack = state.blackPlayer.id === userId;

    if (!isWhite && !isBlack) return { success: false, error: 'Not a player' };

    state.drawOfferFrom = isWhite ? 'white' : 'black';
    return { success: true, offeredBy: state.drawOfferFrom };
  }

  /**
   * Responds to draw offer
   */
  async respondDraw({ gameId, userId, accept }) {
    const gameRecord = this.activeGames.get(gameId);
    if (!gameRecord) return { success: false, error: 'Game not found' };

    const { state } = gameRecord;
    if (!state.drawOfferFrom) return { success: false, error: 'No active draw offer' };

    const isWhite = state.whitePlayer.id === userId;
    const isBlack = state.blackPlayer.id === userId;
    const playerColor = isWhite ? 'white' : isBlack ? 'black' : null;

    if (!playerColor || playerColor === state.drawOfferFrom) {
      return { success: false, error: 'Invalid draw response' };
    }

    if (accept) {
      state.status = 'completed';
      state.result = { winner: 'draw', reason: 'draw_agreement' };
      state.endedAt = new Date().toISOString();
      await this.persistCompletedGame(state);
      await this.redis.set(`game:${gameId}`, JSON.stringify(state));
      return { success: true, accepted: true, state };
    } else {
      state.drawOfferFrom = null;
      return { success: true, accepted: false, state };
    }
  }

  /**
   * Handles player disconnect & starts 30-second grace window
   */
  handlePlayerDisconnect({ socketId, io, graceSeconds = 30 }) {
    for (const [gameId, gameRecord] of this.activeGames.entries()) {
      const { state } = gameRecord;
      if (state.status !== 'active') continue;

      let disconnectedUser = null;
      let opponentSocketId = null;

      if (state.whitePlayer.socketId === socketId && state.whitePlayer.connected) {
        state.whitePlayer.connected = false;
        disconnectedUser = state.whitePlayer;
        opponentSocketId = state.blackPlayer.socketId;
      } else if (state.blackPlayer.socketId === socketId && state.blackPlayer.connected) {
        state.blackPlayer.connected = false;
        disconnectedUser = state.blackPlayer;
        opponentSocketId = state.whitePlayer.socketId;
      }

      if (disconnectedUser) {
        logger.info(`Player ${disconnectedUser.username} disconnected from game ${gameId}. Starting ${graceSeconds}s reconnect timer.`);

        // Notify opponent via Socket room
        if (io) {
          io.to(`game:${gameId}`).emit('opponent:disconnected', {
            username: disconnectedUser.username,
            graceSeconds,
          });
        }

        // Set grace timer
        const timerKey = `${gameId}_${disconnectedUser.id}`;
        if (this.reconnectTimers.has(timerKey)) {
          clearTimeout(this.reconnectTimers.get(timerKey));
        }

        const timer = setTimeout(async () => {
          logger.info(`Reconnect timer expired for ${disconnectedUser.username} in game ${gameId}. Forfeiting game.`);
          state.status = 'abandoned';
          const winnerColor = disconnectedUser.color === 'white' ? 'black' : 'white';
          state.result = { winner: winnerColor, reason: 'abandoned' };
          state.endedAt = new Date().toISOString();

          await this.persistCompletedGame(state);
          this.reconnectTimers.delete(timerKey);

          if (io) {
            io.to(`game:${gameId}`).emit('game:ended', {
              state,
              reason: 'opponent_abandoned',
              message: `${disconnectedUser.username} failed to reconnect in time. ${winnerColor.toUpperCase()} wins!`,
            });
          }
        }, graceSeconds * 1000);

        this.reconnectTimers.set(timerKey, timer);
      }
    }
  }

  /**
   * Handles player reconnection within grace window
   */
  reconnectPlayer({ gameId, userId, newSocketId, io }) {
    const gameRecord = this.activeGames.get(gameId);
    if (!gameRecord) return { success: false, error: 'Game not found' };

    const { state } = gameRecord;
    let reconnectedUser = null;

    if (state.whitePlayer.id === userId) {
      state.whitePlayer.socketId = newSocketId;
      state.whitePlayer.connected = true;
      reconnectedUser = state.whitePlayer;
    } else if (state.blackPlayer.id === userId) {
      state.blackPlayer.socketId = newSocketId;
      state.blackPlayer.connected = true;
      reconnectedUser = state.blackPlayer;
    }

    if (!reconnectedUser) {
      return { success: false, error: 'User does not belong to game' };
    }

    // Cancel reconnect timer if running
    const timerKey = `${gameId}_${userId}`;
    if (this.reconnectTimers.has(timerKey)) {
      clearTimeout(this.reconnectTimers.get(timerKey));
      this.reconnectTimers.delete(timerKey);
      logger.info(`Cancelled reconnect timer for ${reconnectedUser.username} in game ${gameId}`);
    }

    // Notify room of reconnection
    if (io) {
      io.to(`game:${gameId}`).emit('opponent:reconnected', {
        username: reconnectedUser.username,
      });
    }

    logger.info(`Player ${reconnectedUser.username} reconnected to game ${gameId} with new socket ${newSocketId}`);

    return {
      success: true,
      state,
      userColor: reconnectedUser.color,
    };
  }

  /**
   * Persists finished game into MongoDB
   */
  async persistCompletedGame(state) {
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 1) {
        logger.warn(`MongoDB not connected (readyState=${mongoose.connection.readyState}). Skipping DB persistence for game ${state.gameId}.`);
        return;
      }
      await GameModel.findOneAndUpdate(
        { gameId: state.gameId },
        {
          gameId: state.gameId,
          whitePlayer: { id: state.whitePlayer.id, username: state.whitePlayer.username },
          blackPlayer: { id: state.blackPlayer.id, username: state.blackPlayer.username },
          status: state.status,
          result: state.result,
          moves: state.moves,
          finalFen: state.fen,
          startedAt: state.startedAt,
          endedAt: state.endedAt || new Date(),
        },
        { upsert: true, new: true }
      );
      logger.info(`Game ${state.gameId} persisted to MongoDB successfully.`);
    } catch (err) {
      logger.error(`Failed to persist game ${state.gameId} to MongoDB: ${err.message}`);
    }
  }

  /**
   * Helper to clear games map (mainly for testing)
   */
  clearGames() {
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }
    this.reconnectTimers.clear();
    this.activeGames.clear();
  }
}

module.exports = new GameService();
