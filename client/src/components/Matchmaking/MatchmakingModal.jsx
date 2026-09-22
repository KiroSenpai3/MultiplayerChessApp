import React from 'react';
import { X, Search } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';

export function MatchmakingModal() {
  const { matchmakingState } = useGameContext();
  const { cancelMatchmaking } = useSocket();

  if (!matchmakingState.isSearching) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel animate-fadeIn" style={{ maxWidth: '380px', width: '90%', padding: '2rem', textAlign: 'center' }}>
        <div className="radar-container" style={{ marginBottom: '1.25rem' }}>
          <div className="radar-circle"></div>
          <div className="radar-circle"></div>
          <div className="radar-circle"></div>
          <Search size={32} color="#81b64c" />
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem', color: '#ffffff' }}>
          Searching for Opponent
        </h3>

        <p style={{ color: '#8b8987', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Pairing you with a player online...
        </p>

        <button
          className="btn-danger"
          onClick={cancelMatchmaking}
          style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );
}
