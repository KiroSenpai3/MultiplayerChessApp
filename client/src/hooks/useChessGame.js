import { useState, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import { useGameContext } from '../context/GameContext';
import { useSocket } from './useSocket';

export function useChessGame() {
  const { activeGame, userColor } = useGameContext();
  const { makeMove } = useSocket();

  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);

  // Client chess engine instance synced with server FEN
  const chess = useMemo(() => {
    return new Chess(activeGame?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  }, [activeGame?.fen]);

  // Reset selection when turn changes
  useEffect(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [activeGame?.turn]);

  const isMyTurn = useMemo(() => {
    if (!activeGame) return false;
    return activeGame.turn === userColor;
  }, [activeGame, userColor]);

  /**
   * Handles square click interaction
   */
  function handleSquareClick(square) {
    if (!activeGame || activeGame.status !== 'active') return;
    if (!isMyTurn) return;

    const piece = chess.get(square);

    // 1. If clicking on own piece, select it & show legal move target squares (unclick if already selected)
    if (piece && ((piece.color === 'w' && userColor === 'white') || (piece.color === 'b' && userColor === 'black'))) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalMoves(moves);
      return;
    }

    // 2. If a square was already selected and user clicks a legal destination target
    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === square);
      if (isLegal) {
        // Submit move to server
        makeMove(activeGame.gameId, {
          from: selectedSquare,
          to: square,
          promotion: 'q', // Default promotion to queen
        });
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    // Clear selection if clicking empty square or invalid move target
    setSelectedSquare(null);
    setLegalMoves([]);
  }

  const lastMove = useMemo(() => {
    if (!activeGame?.moves || activeGame.moves.length === 0) return null;
    return activeGame.moves[activeGame.moves.length - 1];
  }, [activeGame?.moves]);

  const inCheckSquare = useMemo(() => {
    if (!chess.inCheck()) return null;
    const turnColor = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = board[r][c];
        if (sq && sq.type === 'k' && sq.color === turnColor) {
          return `${String.fromCharCode(97 + c)}${8 - r}`;
        }
      }
    }
    return null;
  }, [chess]);

  return {
    chess,
    isMyTurn,
    selectedSquare,
    legalMoves,
    lastMove,
    inCheckSquare,
    handleSquareClick,
  };
}
