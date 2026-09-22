const matchmakingService = require('../services/matchmaking/matchmakingService');

describe('MatchmakingService Unit Tests', () => {
  beforeEach(async () => {
    await matchmakingService.clearQueue();
  });

  test('Single player joins queue and remains queued', async () => {
    const player1 = { socketId: 'sock_1', userId: 'user_1', username: 'Alice' };
    const res = await matchmakingService.addToQueue(player1);

    expect(res.status).toBe('queued');
    expect(res.match).toBeNull();
  });

  test('Two players joining queue triggers match pairing', async () => {
    const p1 = { socketId: 'sock_1', userId: 'user_1', username: 'Alice' };
    const p2 = { socketId: 'sock_2', userId: 'user_2', username: 'Bob' };

    await matchmakingService.addToQueue(p1);
    const res2 = await matchmakingService.addToQueue(p2);

    expect(res2.status).toBe('queued');
    expect(res2.match).not.toBeNull();
    expect(res2.match.gameId).toBeDefined();
    expect(res2.match.whitePlayer).toBeDefined();
    expect(res2.match.blackPlayer).toBeDefined();

    const colors = [res2.match.whitePlayer.username, res2.match.blackPlayer.username];
    expect(colors).toContain('Alice');
    expect(colors).toContain('Bob');
  });

  test('Prevents duplicate queue entries for the same socket', async () => {
    const p1 = { socketId: 'sock_1', userId: 'user_1', username: 'Alice' };

    await matchmakingService.addToQueue(p1);
    const dupRes = await matchmakingService.addToQueue(p1);

    expect(dupRes.status).toBe('already_queued');
  });

  test('Cancelling matchmaking removes player from queue', async () => {
    const p1 = { socketId: 'sock_1', userId: 'user_1', username: 'Alice' };
    await matchmakingService.addToQueue(p1);

    const cancelRes = await matchmakingService.removeFromQueue('sock_1');
    expect(cancelRes.status).toBe('cancelled');

    const p2 = { socketId: 'sock_2', userId: 'user_2', username: 'Bob' };
    const res2 = await matchmakingService.addToQueue(p2);
    // Should be no match because p1 was cancelled
    expect(res2.match).toBeNull();
  });
});
