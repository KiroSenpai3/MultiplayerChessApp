// High-quality Chess.com "Neo" / "Standard" style vector piece definitions
export const PIECE_SVGS = {
  wp: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,9 C 20.29,9 18.5,10.79 18.5,13 C 18.5,13.89 18.79,14.71 19.28,15.38 C 17.33,16.5 16,18.59 16,21 C 16,23.03 16.94,24.84 18.41,26.03 C 15.41,27.09 11,31.58 11,39.5 L 34,39.5 C 34,31.58 29.59,27.09 26.59,26.03 C 28.06,24.84 29,23.03 29,21 C 29,18.59 27.67,16.5 25.72,15.38 C 26.21,14.71 26.5,13.89 26.5,13 C 26.5,10.79 24.71,9 22.5,9 z" /></g></svg>`,

  wr: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 31,14 L 31,32 L 14,32 L 14,14 L 11,14 z" stroke-linejoin="miter" /><path d="M 12,14 L 33,14" fill="none" stroke="#262421" stroke-width="1" /></g></svg>`,

  wn: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,27.5 23,13" fill="#ffffff" /><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.96,30.06 11.41,27.96 10,28 C 9,28 9.19,29.23 8,30 C 7,30 5.997,31 6,27 C 6,25 12,15 12,15 C 12,15 13.89,13.1 14,11.5 C 13.27,10.56 13.5,9.5 13.5,8.5 C 13.5,7.498 14,6.5 15,6.5 C 16,6.5 17.49,8.5 17,10.5 C 17,10.5 21,11.5 23,16 Z" fill="#ffffff" /><circle cx="15" cy="12" r="1.25" fill="#262421" stroke="none" /></g></svg>`,

  wb: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#ffffff" stroke-linecap="butt"><path d="M 9,36 C 10.25,34.83 12,34 15,34 C 18,34 19.75,34.83 21,36 C 22.25,34.83 24,34 27,34 C 30,34 31.75,34.83 33,36 M 9,36 L 9,39 L 36,39 L 36,36 M 9,36 C 9,32 19,30 22.5,24 C 26,30 36,32 36,36" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32" /><path d="M 22.5,8.5 C 18.5,8.5 15.5,13 15.5,18.5 C 15.5,22 17,25.5 22.5,27.5 C 28,25.5 29.5,22 29.5,18.5 C 29.5,13 26.5,8.5 22.5,8.5 z" /></g><path d="M 22.5,5.5 A 1.5,1.5 0 1,1 22.5,8.5 A 1.5,1.5 0 1,1 22.5,5.5 z" fill="#ffffff" /><path d="M 17.5,26 L 27.5,26" /><path d="M 22.5,12 L 22.5,18.5 M 19.25,15.25 L 25.75,15.25" /></g></svg>`,

  wq: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 8,12 A 2,2 0 1,1 4,12 A 2,2 0 1,1 8,12 z M 24.5,7.5 A 2,2 0 1,1 20.5,7.5 A 2,2 0 1,1 24.5,7.5 z M 41,12 A 2,2 0 1,1 37,12 A 2,2 0 1,1 41,12 z M 16,8.5 A 2,2 0 1,1 12,8.5 A 2,2 0 1,1 16,8.5 z M 33,8.5 A 2,2 0 1,1 29,8.5 A 2,2 0 1,1 33,8.5 z" fill="#ffffff" /><path d="M 9,26 C 10.25,24.83 12,24 15,24 C 18,24 19.75,24.83 21,26 C 22.25,24.83 24,24 27,24 C 30,24 31.75,24.83 33,26 M 9,26 L 9,39 L 36,39 L 36,26" fill="#ffffff" /><path d="M 9,26 L 6,12 L 14,17 L 22.5,9 L 31,17 L 39,12 L 36,26 Z" fill="#ffffff" /><path d="M 11.5,30 C 15,29 30,29 33.5,30 M 12,33.5 C 16,32.5 29,32.5 33,33.5" fill="none" /><circle cx="22.5" cy="31.5" r="2" fill="#262421" stroke="none" /></g></svg>`,

  wk: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.5 L 22.5,5.5 M 19.5,8.5 L 25.5,8.5" stroke-linejoin="miter" /><path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 L 33.5,30 C 33.5,30 42.5,25.5 39.5,19.5 C 36.5,13.5 30,16 22.5,20.5 C 15,16 8.5,13.5 5.5,19.5 C 2.5,25.5 11.5,30 11.5,30 L 11.5,37 z" fill="#ffffff" /><path d="M 11.5,30 C 17,27 28,27 33.5,30" /><path d="M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5" /><path d="M 11.5,37 C 17,34 28,34 33.5,37" /><circle cx="22.5" cy="20" r="3.5" fill="#ffffff" /></g></svg>`,

  bp: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="#262421" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,9 C 20.29,9 18.5,10.79 18.5,13 C 18.5,13.89 18.79,14.71 19.28,15.38 C 17.33,16.5 16,18.59 16,21 C 16,23.03 16.94,24.84 18.41,26.03 C 15.41,27.09 11,31.58 11,39.5 L 34,39.5 C 34,31.58 29.59,27.09 26.59,26.03 C 28.06,24.84 29,23.03 29,21 C 29,18.59 27.67,16.5 25.72,15.38 C 26.21,14.71 26.5,13.89 26.5,13 C 26.5,10.79 24.71,9 22.5,9 z" /><path d="M 14,36.5 A 12,12 0 0,1 31,36.5" fill="none" stroke="#e2e2e2" stroke-width="1.5" /><circle cx="22.5" cy="13" r="1.5" fill="#e2e2e2" stroke="none" /></g></svg>`,

  br: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="#262421" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 L 31,14 L 31,32 L 14,32 L 14,14 L 11,14 z" stroke-linejoin="miter" /><path d="M 12,14 L 33,14" fill="none" stroke="#e2e2e2" stroke-width="1.5" /><path d="M 14,32 L 31,32" fill="none" stroke="#e2e2e2" stroke-width="1.2" /><path d="M 14,16 L 14,30 M 31,16 L 31,30" fill="none" stroke="#e2e2e2" stroke-width="1" /></g></svg>`,

  bn: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,27.5 23,13" fill="#262421" /><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.96,30.06 11.41,27.96 10,28 C 9,28 9.19,29.23 8,30 C 7,30 5.997,31 6,27 C 6,25 12,15 12,15 C 12,15 13.89,13.1 14,11.5 C 13.27,10.56 13.5,9.5 13.5,8.5 C 13.5,7.498 14,6.5 15,6.5 C 16,6.5 17.49,8.5 17,10.5 C 17,10.5 21,11.5 23,16 Z" fill="#262421" /><path d="M 14,11.5 C 14.5,15 10,22 10,28" stroke="#e2e2e2" stroke-width="1.2" /><circle cx="15" cy="12" r="1.25" fill="#e2e2e2" stroke="none" /><path d="M 9.5,25.5 A 0.5,0.5 0 1,1 8.5,25.5 A 0.5,0.5 0 1,1 9.5,25.5 z" fill="#e2e2e2" stroke="#e2e2e2" stroke-width="1" /></g></svg>`,

  bb: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#262421" stroke-linecap="butt"><path d="M 9,36 C 10.25,34.83 12,34 15,34 C 18,34 19.75,34.83 21,36 C 22.25,34.83 24,34 27,34 C 30,34 31.75,34.83 33,36 M 9,36 L 9,39 L 36,39 L 36,36 M 9,36 C 9,32 19,30 22.5,24 C 26,30 36,32 36,36" /><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32" /><path d="M 22.5,8.5 C 18.5,8.5 15.5,13 15.5,18.5 C 15.5,22 17,25.5 22.5,27.5 C 28,25.5 29.5,22 29.5,18.5 C 29.5,13 26.5,8.5 22.5,8.5 z" /></g><circle cx="22.5" cy="7" r="1.5" fill="#e2e2e2" stroke="none" /><path d="M 17.5,26 L 27.5,26" stroke="#e2e2e2" stroke-width="1.2" /><path d="M 22.5,12 L 22.5,18.5 M 19.25,15.25 L 25.75,15.25" stroke="#e2e2e2" stroke-width="1.2" /></g></svg>`,

  bq: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 8,12 A 2,2 0 1,1 4,12 A 2,2 0 1,1 8,12 z M 24.5,7.5 A 2,2 0 1,1 20.5,7.5 A 2,2 0 1,1 24.5,7.5 z M 41,12 A 2,2 0 1,1 37,12 A 2,2 0 1,1 41,12 z M 16,8.5 A 2,2 0 1,1 12,8.5 A 2,2 0 1,1 16,8.5 z M 33,8.5 A 2,2 0 1,1 29,8.5 A 2,2 0 1,1 33,8.5 z" fill="#262421" /><path d="M 9,26 C 10.25,24.83 12,24 15,24 C 18,24 19.75,24.83 21,26 C 22.25,24.83 24,24 27,24 C 30,24 31.75,24.83 33,26 M 9,26 L 9,39 L 36,39 L 36,26" fill="#262421" /><path d="M 9,26 L 6,12 L 14,17 L 22.5,9 L 31,17 L 39,12 L 36,26 Z" fill="#262421" /><path d="M 11.5,30 C 15,29 30,29 33.5,30 M 12,33.5 C 16,32.5 29,32.5 33,33.5" fill="none" stroke="#e2e2e2" stroke-width="1.2" /><circle cx="22.5" cy="31.5" r="2" fill="#e2e2e2" stroke="none" /></g></svg>`,

  bk: `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#262421" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.5 L 22.5,5.5 M 19.5,8.5 L 25.5,8.5" stroke="#e2e2e2" stroke-linejoin="miter" stroke-width="1.5" /><path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 L 33.5,30 C 33.5,30 42.5,25.5 39.5,19.5 C 36.5,13.5 30,16 22.5,20.5 C 15,16 8.5,13.5 5.5,19.5 C 2.5,25.5 11.5,30 11.5,30 L 11.5,37 z" fill="#262421" /><path d="M 11.5,30 C 17,27 28,27 33.5,30" stroke="#e2e2e2" stroke-width="1.2" /><path d="M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5" stroke="#e2e2e2" stroke-width="1.2" /><path d="M 11.5,37 C 17,34 28,34 33.5,37" stroke="#e2e2e2" stroke-width="1.2" /><circle cx="22.5" cy="20" r="3.5" fill="#262421" stroke="#e2e2e2" stroke-width="1.2" /></g></svg>`,
};

/**
 * Calculates captured pieces from chess move history
 */
export function calculateCapturedPieces(moves = []) {
  const initialCounts = { p: 8, r: 2, n: 2, b: 2, q: 1 };
  const currentWhite = { ...initialCounts };
  const currentBlack = { ...initialCounts };

  for (const move of moves) {
    if (move.san && move.san.includes('x')) {
      // Piece was captured
      const targetColor = move.color === 'white' ? 'black' : 'white';
      // Approximate captured piece type from SAN
      let piece = 'p';
      if (move.san.startsWith('N')) piece = 'n';
      else if (move.san.startsWith('B')) piece = 'b';
      else if (move.san.startsWith('R')) piece = 'r';
      else if (move.san.startsWith('Q')) piece = 'q';

      if (targetColor === 'white') {
        currentWhite[piece] = Math.max(0, currentWhite[piece] - 1);
      } else {
        currentBlack[piece] = Math.max(0, currentBlack[piece] - 1);
      }
    }
  }

  const capturedByWhite = [];
  const capturedByBlack = [];

  for (const [piece, initCount] of Object.entries(initialCounts)) {
    const missingWhite = initCount - currentWhite[piece];
    for (let i = 0; i < missingWhite; i++) capturedByBlack.push(`w${piece}`);

    const missingBlack = initCount - currentBlack[piece];
    for (let i = 0; i < missingBlack; i++) capturedByWhite.push(`b${piece}`);
  }

  return { capturedByWhite, capturedByBlack };
}
