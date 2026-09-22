const mongoose = require('mongoose');

const MoveSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    promotion: { type: String },
    san: { type: String, required: true },
    fen: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const GameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    whitePlayer: {
      id: { type: String, required: true },
      username: { type: String, required: true },
    },
    blackPlayer: {
      id: { type: String, required: true },
      username: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ['waiting', 'active', 'completed', 'abandoned'],
      default: 'active',
      index: true,
    },
    result: {
      winner: { type: String, enum: ['white', 'black', 'draw', null], default: null },
      reason: {
        type: String,
        enum: ['checkmate', 'resignation', 'timeout', 'abandoned', 'stalemate', 'insufficient_material', 'threefold_repetition', 'fifty_move_rule', 'draw_agreement', null],
        default: null,
      },
    },
    moves: [MoveSchema],
    finalFen: {
      type: String,
      default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', GameSchema);
