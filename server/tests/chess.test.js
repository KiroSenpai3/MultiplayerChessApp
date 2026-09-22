const gameService = require('../services/game/gameService');
const { connectDB, closeDB } = require('../config/db');

describe('GameService Chess Engine Unit Tests', () => {
  let gameId;
  const whitePlayer = { userId: 'u_white', socketId: 's_white', username: 'WhitePlayer' };
  const blackPlayer = { userId: 'u_black', socketId: 's_black', username: 'BlackPlayer' };

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  beforeEach(async () => {
    gameService.clearGames();
    gameId = 'game_test_123';
    await gameService.createGame({ gameId, whitePlayer, blackPlayer });
  });

  test('Game creates with initial state and White to move', () => {
    const game = gameService.getGame(gameId);
    expect(game).not.toBeNull();
    expect(game.turn).toBe('white');
    expect(game.status).toBe('active');
    expect(game.moves).toHaveLength(0);
  });

  test('Authoritative legal move execution updates state and toggles turn', async () => {
    // White plays e2 -> e4
    const res = await gameService.makeMove({
      gameId,
      socketId: 's_white',
      userId: 'u_white',
      move: { from: 'e2', to: 'e4' },
    });

    expect(res.valid).toBe(true);
    expect(res.move.san).toBe('e4');
    expect(res.state.turn).toBe('black');
    expect(res.state.moves).toHaveLength(1);
  });

  test('Reject move when it is not player turn', async () => {
    // Black tries to move first
    const res = await gameService.makeMove({
      gameId,
      socketId: 's_black',
      userId: 'u_black',
      move: { from: 'e7', to: 'e5' },
    });

    expect(res.valid).toBe(false);
    expect(res.error).toMatch(/not your turn/i);
  });

  test('Reject illegal move (e.g. Pawn moving backwards or invalid move)', async () => {
    // White tries illegal move e2 -> e5
    const res = await gameService.makeMove({
      gameId,
      socketId: 's_white',
      userId: 'u_white',
      move: { from: 'e2', to: 'e5' },
    });

    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
  });

  test('Detects Fool\'s Mate checkmate and sets game outcome', async () => {
    // 1. f3
    await gameService.makeMove({ gameId, socketId: 's_white', userId: 'u_white', move: { from: 'f2', to: 'f3' } });
    // 1... e5
    await gameService.makeMove({ gameId, socketId: 's_black', userId: 'u_black', move: { from: 'e7', to: 'e5' } });
    // 2. g4
    await gameService.makeMove({ gameId, socketId: 's_white', userId: 'u_white', move: { from: 'g2', to: 'g4' } });
    // 2... Qh4#
    const res = await gameService.makeMove({ gameId, socketId: 's_black', userId: 'u_black', move: { from: 'd8', to: 'h4' } });

    expect(res.valid).toBe(true);
    expect(res.state.isGameOver).toBe(true);
    expect(res.state.status).toBe('completed');
    expect(res.state.result.winner).toBe('black');
    expect(res.state.result.reason).toBe('checkmate');
  });

  test('Player resignation forfeits game immediately', async () => {
    const res = await gameService.resignGame({ gameId, socketId: 's_white', userId: 'u_white' });

    expect(res.success).toBe(true);
    expect(res.state.status).toBe('completed');
    expect(res.state.result.winner).toBe('black');
    expect(res.state.result.reason).toBe('resignation');
  });
});
