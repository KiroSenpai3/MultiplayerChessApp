import React, { useState } from 'react';
import { Swords, User, Shield, Zap, Globe } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import { ConnectionStatus } from '../components/ConnectionStatus/ConnectionStatus';
import { MatchmakingModal } from '../components/Matchmaking/MatchmakingModal';

export function Home() {
  const { user, setUser } = useGameContext();
  const { startMatchmaking } = useSocket();
  const [nameInput, setNameInput] = useState(user?.username || '');

  function handleStartMatch() {
    const finalName = nameInput.trim() || user?.username || 'Guest';
    if (user && finalName !== user.username) {
      setUser({ ...user, username: finalName });
      sessionStorage.setItem('multchess_username', finalName);
    }
    startMatchmaking(finalName);
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1rem' }}>
      {/* Header Bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '6px', background: '#81b64c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Swords size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
            MultChess
          </h1>
        </div>

        <ConnectionStatus />
      </header>

      {/* Main Play Card */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
          Play Chess Online
        </h2>

        <p style={{ color: '#8b8987', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
          Real-time multiplayer chess. Instant matchmaking, authoritative rule validation, and seamless connection.
        </p>

        {/* Username Input & Play Trigger */}
        <div style={{ maxWidth: '380px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} color="#8b8987" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter player name..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 2.5rem',
                borderRadius: '6px',
                background: '#161512',
                border: '1px solid #363431',
                color: '#e2e2e2',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>

          <button className="btn-primary" onClick={handleStartMatch} style={{ width: '100%', padding: '0.95rem', fontSize: '1.1rem' }}>
            <Swords size={20} /> Play Online
          </button>
        </div>
      </div>

      {/* Feature Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <Zap size={24} color="#81b64c" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: '#e2e2e2' }}>Instant Matchmaking</h3>
          <p style={{ fontSize: '0.85rem', color: '#8b8987', lineHeight: 1.4 }}>
            Fast pairing system connects compatible players instantly into a clean live game room.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <Shield size={24} color="#81b64c" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: '#e2e2e2' }}>FIDE Rule Engine</h3>
          <p style={{ fontSize: '0.85rem', color: '#8b8987', lineHeight: 1.4 }}>
            Server validates moves, turn sequence, checkmate, stalemate, and draw conditions.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <Globe size={24} color="#81b64c" style={{ marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.3rem', color: '#e2e2e2' }}>Disconnect Protection</h3>
          <p style={{ fontSize: '0.85rem', color: '#8b8987', lineHeight: 1.4 }}>
            30-second grace window lets players reconnect to active matches without forfeiting state.
          </p>
        </div>
      </div>

      <MatchmakingModal />
    </div>
  );
}
