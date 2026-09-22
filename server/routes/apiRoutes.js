const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const gameController = require('../controllers/gameController');

// Health Check Endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// User Endpoints
router.post('/users', userController.getOrCreateUser);
router.get('/users/:id', userController.getUserById);
router.get('/users/:id/games', userController.getUserGames);

// Game Endpoints
router.get('/games/recent', gameController.getRecentGames);
router.get('/games/:gameId', gameController.getGameById);

module.exports = router;
