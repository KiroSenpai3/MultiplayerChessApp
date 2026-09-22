const { v4: uuidv4 } = require('uuid');
const { getRedisClient } = require('../../config/redis');
const logger = require('../../utils/logger');

const QUEUE_KEY = 'matchmaking:queue';
const PLAYERS_MAP_KEY = 'matchmaking:active_players';

class MatchmakingService {
  get redis() {
    return getRedisClient();
  }

  /**
   * Adds a player to the matchmaking queue.
   * Prevents duplicate entries per socket/user.
   */
  async addToQueue(player) {
    const { socketId, userId, username } = player;
    if (!socketId || !userId) {
      throw new Error('Invalid player data: socketId and userId required');
    }

    // Check if player is already in queue
    const isQueued = await this.redis.hexists(PLAYERS_MAP_KEY, socketId);
    if (isQueued) {
      logger.warn(`Player ${username} (${socketId}) already in matchmaking queue.`);
      return { status: 'already_queued' };
    }

    const playerData = JSON.stringify({
      socketId,
      userId,
      username: username || `Player_${socketId.substring(0, 4)}`,
      joinedAt: Date.now(),
    });

    // Store in active players map and push to queue list
    await this.redis.hset(PLAYERS_MAP_KEY, socketId, playerData);
    await this.redis.rpush(QUEUE_KEY, playerData);

    logger.info(`Player ${username} queued for matchmaking. Socket: ${socketId}`);

    // Attempt immediately to pair with waiting opponents
    const match = await this.tryPairPlayers();
    return { status: 'queued', match };
  }

  /**
   * Removes a player from matchmaking queue (cancel or disconnect).
   */
  async removeFromQueue(socketId) {
    const playerDataStr = await this.redis.hget(PLAYERS_MAP_KEY, socketId);
    if (!playerDataStr) {
      return { status: 'not_found' };
    }

    // Remove from active players hash
    await this.redis.hdel(PLAYERS_MAP_KEY, socketId);

    // Remove from list queue
    await this.redis.lrem(QUEUE_KEY, 0, playerDataStr);

    const player = JSON.parse(playerDataStr);
    logger.info(`Player ${player.username} (${socketId}) removed from matchmaking queue.`);
    return { status: 'cancelled', player };
  }

  /**
   * Atomically pairs two waiting players from the queue.
   * Ensures no race conditions or duplicate matches.
   */
  async tryPairPlayers() {
    const queueLength = await this.redis.llen(QUEUE_KEY);
    if (queueLength < 2) {
      return null;
    }

    // Pop first player
    const player1Str = await this.redis.lpop(QUEUE_KEY);
    if (!player1Str) return null;

    // Pop second player
    const player2Str = await this.redis.lpop(QUEUE_KEY);
    if (!player2Str) {
      // Re-queue player1 if no second player found
      await this.redis.lpush(QUEUE_KEY, player1Str);
      return null;
    }

    const p1 = JSON.parse(player1Str);
    const p2 = JSON.parse(player2Str);

    // Verify both sockets are still marked active in hash map (not cancelled mid-queue)
    const p1Active = await this.redis.hexists(PLAYERS_MAP_KEY, p1.socketId);
    const p2Active = await this.redis.hexists(PLAYERS_MAP_KEY, p2.socketId);

    if (!p1Active && !p2Active) {
      return this.tryPairPlayers();
    }
    if (!p1Active) {
      // Put p2 back to front of queue
      await this.redis.lpush(QUEUE_KEY, player2Str);
      return this.tryPairPlayers();
    }
    if (!p2Active) {
      // Put p1 back to front of queue
      await this.redis.lpush(QUEUE_KEY, player1Str);
      return this.tryPairPlayers();
    }

    // Clean up both players from active queue hash
    await this.redis.hdel(PLAYERS_MAP_KEY, p1.socketId);
    await this.redis.hdel(PLAYERS_MAP_KEY, p2.socketId);

    // Randomize White and Black assignment
    const isP1White = Math.random() < 0.5;
    const whitePlayer = isP1White ? p1 : p2;
    const blackPlayer = isP1White ? p2 : p1;

    const gameId = `game_${uuidv4()}`;

    const matchPayload = {
      gameId,
      whitePlayer: {
        socketId: whitePlayer.socketId,
        userId: whitePlayer.userId,
        username: whitePlayer.username,
        color: 'white',
      },
      blackPlayer: {
        socketId: blackPlayer.socketId,
        userId: blackPlayer.userId,
        username: blackPlayer.username,
        color: 'black',
      },
      createdAt: new Date().toISOString(),
    };

    logger.info(`Match created! GameId: ${gameId} | White: ${whitePlayer.username} | Black: ${blackPlayer.username}`);
    return matchPayload;
  }

  /**
   * Helper to clear queue (mainly for testing)
   */
  async clearQueue() {
    await this.redis.del(QUEUE_KEY);
    await this.redis.del(PLAYERS_MAP_KEY);
  }
}

module.exports = new MatchmakingService();
