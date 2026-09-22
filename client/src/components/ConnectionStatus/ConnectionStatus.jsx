import React from 'react';
import { useGameContext } from '../../context/GameContext';

export function ConnectionStatus() {
  const { socketConnected } = useGameContext();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.85rem',
        fontWeight: 600,
        color: socketConnected ? '#8b8987' : '#ef4444',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: socketConnected ? '#81b64c' : '#ef4444',
          display: 'inline-block',
        }}
      />
      {socketConnected ? 'Online' : 'Reconnecting...'}
    </div>
  );
}
