const envUrl = import.meta.env.VITE_SERVER_URL;
const API_BASE = envUrl ? `${envUrl}/api` : '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function getOrCreateUser(sessionId, username) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, username }),
  });
  return res.json();
}

export async function getGame(gameId) {
  const res = await fetch(`${API_BASE}/games/${gameId}`);
  return res.json();
}

export async function getUserGames(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/games`);
  return res.json();
}
