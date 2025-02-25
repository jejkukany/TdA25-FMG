import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validateBoard = (board: string[][], currentPlayer: "X" | "O") => {
  const size = 15;

  // Check board dimensions
  if (board.length !== size || board.some((row) => row.length !== size)) {
    console.error("Validation Error: Invalid board dimensions");
    return "Invalid board dimensions. Board must be 15x15.";
  }

  // Validate symbols
  const flatBoard = board.flat();
  const xCount = flatBoard.filter((cell) => cell === "X").length;
  const oCount = flatBoard.filter((cell) => cell === "O").length;

  if (!flatBoard.every((cell) => cell === "" || cell === "X" || cell === "O")) {
    console.error("Validation Error: Invalid symbols found", flatBoard);
    return "Invalid symbols on the board. Only 'X', 'O', and empty cells are allowed.";
  }

  // Validate turn order
  if (xCount !== oCount && xCount !== oCount + 1) {
    console.error("Validation Error: Invalid turn order", { xCount, oCount });
    return "Invalid turn order. X must have one more move than O or the same number of moves.";
  }

  // Check the current player
  if (
    (currentPlayer === "X" && xCount > oCount) || // X's turn but fewer or equal Xs
    (currentPlayer === "O" && xCount < oCount) // O's turn but fewer Os
  ) {
    console.error("Validation Error: Invalid current player", {
      currentPlayer,
      xCount,
      oCount,
    });
    return "Invalid current player.";
  }

  return null; // Valid board
};

export const determineGameState = (
  board: string[][],
  totalMoves: number,
  currentPlayer: "X" | "O",
): string => {
  const xWin = checkEndGame(board, "X");
  const oWin = checkEndGame(board, "O");

  // 1. Check for Endgame (Potential winning move)
  const currentPlayerHasWinningMove = hasPotentialWin(board, currentPlayer);
  if (xWin || oWin || currentPlayerHasWinningMove) {
    return "endgame";
  }

  // 2. Check for Opening (5 or fewer moves)
  if (totalMoves <= 5) {
    return "opening";
  }

  // 3. Check for Middle game (6 or more moves, no immediate win)
  if (totalMoves >= 6) {
    return "midgame";
  }

  // Default to unknown
  return "unknown";
};

export const checkEndGame = (board: string[][], symbol: string): boolean => {
  const size = board.length;

  const checkWin = (row: number, col: number, dRow: number, dCol: number) => {
    for (let i = 0; i < 5; i++) {
      const r = row + i * dRow;
      const c = col + i * dCol;
      if (r < 0 || c < 0 || r >= size || c >= size || board[r][c] !== symbol) {
        return false;
      }
    }
    return true; // Exactly 5 in a row
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (
        checkWin(row, col, 0, 1) || // Horizontal
        checkWin(row, col, 1, 0) || // Vertical
        checkWin(row, col, 1, 1) || // Diagonal down-right
        checkWin(row, col, 1, -1) // Diagonal down-left
      ) {
        return true;
      }
    }
  }

  return false;
};

export const hasPotentialWin = (board: string[][], symbol: string): boolean => {
  const size = board.length;

  const checkPotential = (
    row: number,
    col: number,
    dRow: number,
    dCol: number,
  ) => {
    let count = 0;
    let gaps = 0;

    for (let i = 0; i < 5; i++) {
      const r = row + i * dRow;
      const c = col + i * dCol;

      if (r < 0 || c < 0 || r >= size || c >= size) {
        return false; // Outside bounds
      }

      const cell = board[r][c];
      if (cell === symbol) {
        count++;
      } else if (cell === "") {
        gaps++;
      } else {
        return false; // Opponent's piece blocks the potential win
      }

      if (gaps > 1) return false; // Too many gaps
    }

    return count === 4 && gaps === 1; // Exactly 4 with one gap
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (
        checkPotential(row, col, 0, 1) || // Horizontal
        checkPotential(row, col, 1, 0) || // Vertical
        checkPotential(row, col, 1, 1) || // Diagonal down-right
        checkPotential(row, col, 1, -1) // Diagonal down-left
      ) {
        return true;
      }
    }
  }

  return false;
};
