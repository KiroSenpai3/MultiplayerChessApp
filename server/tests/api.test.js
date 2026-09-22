const request = require('supertest');
const app = require('../app');
const { connectDB, closeDB } = require('../config/db');

describe('REST API Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await closeDB();
  });

  test('GET /api/health returns status 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  test('POST /api/users creates or fetches a user session', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ sessionId: 'test_session_123', username: 'TestPlayer' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.username).toBe('TestPlayer');
    expect(res.body.user.sessionId).toBe('test_session_123');
  });

  test('GET /api/games/recent returns array of completed games', async () => {
    const res = await request(app).get('/api/games/recent');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.games)).toBe(true);
  });
});
