import React from 'react';
import { useChessGame } from '../../hooks/useChessGame';
import { useGameContext } from '../../context/GameContext';
import { PIECE_SVGS } from '../../utils/chessHelpers';

export function ChessBoard() {
  const { userColor } = useGameContext();
  const {
    chess,
    selectedSquare,
    legalMoves,
    lastMove,
    inCheckSquare,
    handleSquareClick,
  } = useChessGame();

  const board = chess.board(); // 8x8 array starting from rank 8 (row 0) to rank 1 (row 7)

  // Determine row and col iteration order based on board orientation
  const rows = userColor === 'black' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = userColor === 'black' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className="chessboard-wrapper">
      {rows.map((rIndex) =>
        cols.map((cIndex) => {
          const squareName = `${files[cIndex]}${8 - rIndex}`;
          const isLight = (rIndex + cIndex) % 2 === 0;
          const piece = board[rIndex][cIndex];

          const isSelected = selectedSquare === squareName;
          const isLastMove = lastMove && (lastMove.from === squareName || lastMove.to === squareName);
          const isInCheck = inCheckSquare === squareName;
          const legalTarget = legalMoves.find((m) => m.to === squareName);

          const pieceKey = piece ? `${piece.color}${piece.type}` : null;
          const pieceSvg = pieceKey ? PIECE_SVGS[pieceKey] : null;

          return (
            <div
              key={squareName}
              className={`chess-square ${isLight ? 'light' : 'dark'} ${
                isSelected ? 'selected' : ''
              } ${isLastMove ? 'last-move' : ''} ${isInCheck ? 'in-check' : ''}`}
              onClick={() => handleSquareClick(squareName)}
            >
              {/* Rank coordinate label (leftmost column) */}
              {(userColor === 'black' ? cIndex === 7 : cIndex === 0) && (
                <span className="coord-rank">{8 - rIndex}</span>
              )}

              {/* File coordinate label (bottommost row) */}
              {(userColor === 'black' ? rIndex === 0 : rIndex === 7) && (
                <span className="coord-file">{files[cIndex]}</span>
              )}

              {/* Piece SVG rendering */}
              {pieceSvg && (
                <div
                  className="chess-piece-img"
                  dangerouslySetInnerHTML={{ __html: pieceSvg }}
                />
              )}

              {/* Legal Move Indicators */}
              {legalTarget && !piece && <div className="legal-dot" />}
              {legalTarget && piece && <div className="legal-capture-ring" />}
            </div>
          );
        })
      )}
    </div>
  );
}
