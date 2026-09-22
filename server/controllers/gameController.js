const Game = require('../models/Game');
const gameService = require('../services/game/gameService');

exports.getGameById = async (req, res, next) => {
  try {
    const { gameId } = req.params;

    // First check active game state in memory/Redis
    const activeState = gameService.getGame(gameId);
    if (activeState) {
      return res.json({ success: true, isLive: true, game: activeState });
    }

    // Fall back to persistent MongoDB record
    const persistentGame = await Game.findOne({ gameId });
    if (!persistentGame) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    res.json({ success: true, isLive: false, game: persistentGame });
  } catch (err) {
    next(err);
  }
};

exports.getRecentGames = async (req, res, next) => {
  try {
    const games = await Game.find({ status: 'completed' })
      .sort({ endedAt: -1 })
      .limit(10);

    res.json({ success: true, count: games.length, games });
  } catch (err) {
    next(err);
  }
};
