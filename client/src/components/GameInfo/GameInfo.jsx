import React, { useState } from 'react';
import { Flag, Handshake, Share2, Check } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';

export function GameInfo() {
  const { activeGame, userColor, drawOffer } = useGameContext();
  const { resignGame, offerDraw, respondDraw } = useSocket();
  const [copied, setCopied] = useState(false);

  if (!activeGame) return null;

  const moves = activeGame.moves || [];
  
  const movePairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      num: Math.floor(i / 2) + 1,
      white: moves[i]?.san || '',
      black: moves[i + 1]?.san || '',
    });
  }

  function handleCopyRoom() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      {/* Header Turn / Status Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #363431', paddingBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#8b8987', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Turn</span>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: activeGame.turn === 'white' ? '#ffffff' : '#81b64c' }}>
            {activeGame.turn === userColor ? 'Your Turn' : "Opponent's Turn"}
          </div>
        </div>

        <button className="btn-secondary" onClick={handleCopyRoom} style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', gap: '0.3rem' }}>
          {copied ? <Check size={14} color="#81b64c" /> : <Share2 size={14} />}
          {copied ? 'Copied' : 'Share'}
        </button>
      </div>

      {/* Draw Offer Banner */}
      {drawOffer && (
        <div style={{ background: '#363431', border: '1px solid #e5a93c', borderRadius: '6px', padding: '0.75rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#e5a93c' }}>
            Draw offered by opponent
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => respondDraw(activeGame.gameId, true)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              Accept
            </button>
            <button className="btn-danger" onClick={() => respondDraw(activeGame.gameId, false)} style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Move History Table */}
      <div style={{ flex: 1, minHeight: '180px', maxHeight: '300px', overflowY: 'auto', background: '#161512', borderRadius: '6px', padding: '0.75rem', border: '1px solid #363431' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b8987', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>MOVES</div>
        {movePairs.length === 0 ? (
          <div style={{ color: '#7c7975', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem' }}>
            Game started. White to move.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 1fr', gap: '0.25rem', fontSize: '0.85rem' }}>
            {movePairs.map((pair) => (
              <React.Fragment key={pair.num}>
                <span style={{ color: '#7c7975', fontWeight: 600 }}>{pair.num}.</span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>{pair.white}</span>
                <span style={{ color: '#bababa', fontWeight: 500 }}>{pair.black}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Game Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
        <button
          className="btn-secondary"
          onClick={() => offerDraw(activeGame.gameId)}
          disabled={activeGame.status !== 'active'}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Handshake size={16} /> Draw
        </button>

        <button
          className="btn-danger"
          onClick={() => resignGame(activeGame.gameId)}
          disabled={activeGame.status !== 'active'}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <Flag size={16} /> Resign
        </button>
      </div>
    </div>
  );
}
