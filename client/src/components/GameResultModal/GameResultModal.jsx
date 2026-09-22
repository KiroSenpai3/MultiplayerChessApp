import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Home, Swords } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';
import { useSocket } from '../../hooks/useSocket';

export function GameResultModal() {
  const navigate = useNavigate();
  const { gameResult, userColor, setGameResult, setActiveGame } = useGameContext();
  const { startMatchmaking } = useSocket();

  const isWinner = gameResult?.winner === userColor;
  const isDraw = gameResult?.winner === 'draw';

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [isWinner]);

  if (!gameResult) return null;

  function handlePlayAgain() {
    setGameResult(null);
    setActiveGame(null);
    startMatchmaking();
  }

  function handleReturnHome() {
    setGameResult(null);
    setActiveGame(null);
    navigate('/');
  }

  return (
    <div className="modal-overlay">
      <div className="glass-panel animate-fadeIn" style={{ maxWidth: '380px', width: '90%', padding: '2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
          {isWinner ? (
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(129, 182, 76, 0.2)', border: '2px solid #81b64c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={32} color="#81b64c" />
            </div>
          ) : isDraw ? (
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(229, 169, 60, 0.2)', border: '2px solid #e5a93c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Swords size={32} color="#e5a93c" />
            </div>
          ) : (
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(204, 51, 51, 0.2)', border: '2px solid #cc3333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Trophy size={32} color="#cc3333" />
            </div>
          )}
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
          {isWinner ? 'Victory!' : isDraw ? 'Game Drawn' : 'Game Over'}
        </h2>

        <p style={{ color: '#bababa', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
          {gameResult.message || `${gameResult.winner.toUpperCase()} won by ${gameResult.reason}!`}
        </p>

        <div style={{ background: '#161512', border: '1px solid #363431', borderRadius: '6px', padding: '0.85rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8b8987' }}>Result</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isWinner ? '#81b64c' : isDraw ? '#e5a93c' : '#ef4444' }}>
              {isWinner ? 'Win' : isDraw ? 'Draw' : 'Loss'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#8b8987' }}>Method</span>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', textTransform: 'capitalize' }}>
              {gameResult.reason ? gameResult.reason.replace('_', ' ') : 'Finished'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn-primary" onClick={handlePlayAgain} style={{ flex: 1, padding: '0.75rem' }}>
            <RefreshCw size={16} /> Play Again
          </button>
          <button className="btn-secondary" onClick={handleReturnHome} style={{ flex: 1, padding: '0.75rem' }}>
            <Home size={16} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
