"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface BoardProps {
  initialBoard: string[][];
}

const Board: React.FC<BoardProps> = ({ initialBoard }) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [moves, setMoves] = useState<string[]>([]);

  const checkWinner = (board: string[][], symbol: string): boolean => {
    const size = board.length;

    // Check rows
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 5; col++) {
        if (board[row].slice(col, col + 5).every((cell) => cell === symbol)) {
          return true;
        }
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 5; row++) {
        if (board.slice(row, row + 5).every((r) => r[col] === symbol)) {
          return true;
        }
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - 5; row++) {
      for (let col = 0; col <= size - 5; col++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col + i] === symbol)) {
          return true;
        }
      }
    }

    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - 5; row++) {
      for (let col = 4; col < size; col++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col - i] === symbol)) {
          return true;
        }
      }
    }

    return false;
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (board[rowIndex][cellIndex] !== "" || winner) {
      return;
    }

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === cellIndex ? currentPlayer : cell,
      ),
    );

    setBoard(newBoard);
    setMoves((prevMoves) => [
      ...prevMoves,
      `${currentPlayer} played at (${rowIndex + 1}, ${cellIndex + 1})`,
    ]);

    if (checkWinner(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 md:p-8">
      {winner ? (
        <div className="text-xl font-bold text-center">Winner: {winner}</div>
      ) : (
        <div className="text-lg font-semibold text-center">
          Current Player: {currentPlayer}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl md:px-0 px-3">
        {/* Board */}
        <div
          className="grid border border-gray-400 mx-auto w-full rounded-lg overflow-hidden"
          style={{
            gridTemplateColumns: "repeat(15, 1fr)",
          }}
        >
          {board.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div
                key={`${rowIndex}-${cellIndex}`}
                className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center aspect-square ${
                  rowIndex === 0 && cellIndex === 0
                    ? "rounded-tl-[7px]"
                    : rowIndex === 0 && cellIndex === 14
                      ? "rounded-tr-[7px]"
                      : rowIndex === 14 && cellIndex === 0
                        ? "rounded-bl-[7px]"
                        : rowIndex === 14 && cellIndex === 14
                          ? "rounded-br-[7px]"
                          : ""
                }`}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
                style={{ cursor: "pointer" }}
              >
                {cell === "X" && (
                  <img
                    src="/X_cerne.svg"
                    alt="X"
                    className="w-3/4 dark:hidden"
                  />
                )}
                {cell === "X" && (
                  <img
                    src="/X_bile.svg"
                    alt="X"
                    className="w-3/4 hidden dark:block"
                  />
                )}
                {cell === "O" && (
                  <img
                    src="/O_cerne.svg"
                    alt="O"
                    className="w-3/4 dark:hidden"
                  />
                )}
                {cell === "O" && (
                  <img
                    src="/O_bile.svg"
                    alt="O"
                    className="w-3/4 hidden dark:block"
                  />
                )}
              </div>
            )),
          )}
        </div>

        {/* Moves and Save */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <h2 className="text-lg font-bold">Moves</h2>
          <div className="flex flex-col gap-1 overflow-auto max-h-64 border border-gray-300 p-2 rounded-lg">
            {moves.map((move, index) => (
              <div key={index} className="text-sm">
                {move}
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={() => alert("Game saved!")}>
            Save Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Board;
