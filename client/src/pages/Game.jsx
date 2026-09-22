import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WifiOff, ArrowLeft } from 'lucide-react';
import { useGameContext } from '../context/GameContext';
import { useSocket } from '../hooks/useSocket';
import { ChessBoard } from '../components/ChessBoard/ChessBoard';
import { PlayerCard } from '../components/PlayerCard/PlayerCard';
import { GameInfo } from '../components/GameInfo/GameInfo';
import { ConnectionStatus } from '../components/ConnectionStatus/ConnectionStatus';
import { GameResultModal } from '../components/GameResultModal/GameResultModal';
import { calculateCapturedPieces } from '../utils/chessHelpers';

export function Game() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { activeGame, userColor, user, disconnectInfo } = useGameContext();
  const { reconnectGame } = useSocket();

  // Attempt game room subscription or state restoration on mount
  useEffect(() => {
    if (gameId) {
      reconnectGame(gameId);
    }
  }, [gameId]);

  if (!activeGame) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <div className="glass-panel" style={{ padding: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Connecting to Game Room...</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Game ID: {gameId}</p>
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <ArrowLeft size={18} /> Return Home
          </button>
        </div>
      </div>
    );
  }

  const isWhite = userColor === 'white';
  const opponentPlayer = isWhite ? activeGame.blackPlayer : activeGame.whitePlayer;
  const selfPlayer = isWhite ? activeGame.whitePlayer : activeGame.blackPlayer;

  const { capturedByWhite, capturedByBlack } = calculateCapturedPieces(activeGame.moves);
  const selfCaptured = isWhite ? capturedByWhite : capturedByBlack;
  const opponentCaptured = isWhite ? capturedByBlack : capturedByWhite;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button className="btn-secondary" onClick={() => navigate('/')} style={{ fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Home
        </button>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Game #{gameId.substring(0, 12)}</h2>
          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            YOU ARE PLAYING AS {userColor.toUpperCase()}
          </span>
        </div>

        <ConnectionStatus />
      </header>

      {/* Disconnect Warning Banner */}
      {disconnectInfo && (
        <div style={{ background: 'rgba(244, 63, 94, 0.2)', border: '1px solid #f43f5e', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <WifiOff size={22} color="#f43f5e" />
          <div>
            <strong style={{ color: '#f43f5e' }}>Opponent Disconnected!</strong>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              Waiting {disconnectInfo.graceSeconds}s for {disconnectInfo.username} to reconnect...
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Board + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 600px) minmax(280px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Opponent Card + Chess Board + Self Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <PlayerCard
            player={opponentPlayer}
            isTurn={activeGame.turn !== userColor}
            capturedPieces={opponentCaptured}
            isOpponent={true}
          />

          <ChessBoard />

          <PlayerCard
            player={selfPlayer}
            isTurn={activeGame.turn === userColor}
            capturedPieces={selfCaptured}
            isOpponent={false}
          />
        </div>

        {/* Right Column: Game Info & Move History */}
        <div style={{ height: '100%', minHeight: '520px' }}>
          <GameInfo />
        </div>
      </div>

      <GameResultModal />
    </div>
  );
}
