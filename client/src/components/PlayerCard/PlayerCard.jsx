import React from 'react';
import { User, WifiOff } from 'lucide-react';
import { PIECE_SVGS } from '../../utils/chessHelpers';

export function PlayerCard({ player, isTurn, capturedPieces = [], isOpponent = false }) {
  if (!player) {
    return (
      <div className="glass-panel" style={{ padding: '0.75rem 1rem', opacity: 0.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <User size={20} color="#8b8987" />
          <span style={{ fontSize: '0.9rem', color: '#8b8987' }}>Connecting player...</span>
        </div>
      </div>
    );
  }

  const isWhite = player.color === 'white';

  return (
    <div
      className="glass-panel"
      style={{
        padding: '0.75rem 1rem',
        borderLeft: isTurn ? `3px solid ${isWhite ? '#ffffff' : '#81b64c'}` : '3px solid transparent',
        background: isTurn ? '#302e2b' : '#262421',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Color Badge */}
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '4px',
              background: isWhite ? '#eeeed2' : '#363431',
              color: isWhite ? '#161512' : '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.8rem',
              border: '1px solid #45423e',
            }}
          >
            {isWhite ? 'W' : 'B'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{player.username}</span>
              {player.connected === false && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#ef4444', fontSize: '0.75rem' }}>
                  <WifiOff size={12} /> Disconnected
                </span>
              )}
            </div>
            {isTurn && (
              <span style={{ fontSize: '0.75rem', color: '#81b64c', fontWeight: 700 }}>
                Thinking...
              </span>
            )}
          </div>
        </div>

        {/* Captured Pieces Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {capturedPieces.map((pieceKey, idx) => (
            <div
              key={idx}
              style={{ width: '20px', height: '20px' }}
              dangerouslySetInnerHTML={{ __html: PIECE_SVGS[pieceKey] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
