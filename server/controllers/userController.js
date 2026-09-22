const User = require('../models/User');
const Game = require('../models/Game');

exports.getOrCreateUser = async (req, res, next) => {
  try {
    const { username, sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required' });
    }

    let user = await User.findOne({ sessionId });
    if (!user) {
      const displayUsername = username || `Player_${sessionId.substring(0, 6)}`;
      user = await User.create({
        sessionId,
        username: displayUsername,
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).or([{ sessionId: id }]);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.getUserGames = async (req, res, next) => {
  try {
    const { id } = req.params;
    const games = await Game.find({
      $or: [{ 'whitePlayer.id': id }, { 'blackPlayer.id': id }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, count: games.length, games });
  } catch (err) {
    next(err);
  }
};
