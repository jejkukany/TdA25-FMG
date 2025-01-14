"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { VictoryModal } from "./VictoryModal";
import { useNextGame } from "@/queries/useNextGame";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface BoardProps {
  initialBoard: string[][];
}

const Board: React.FC<BoardProps> = ({ initialBoard }) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nextGameParams = useParams<{ uuid: string }>();
  const router = useRouter();

  const { data: nextGame} = useNextGame(nextGameParams.uuid);

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

    if (checkWinner(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      setIsModalOpen(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const handleNextGame = () => {
    if (nextGame) {
      router.push(`/game/${nextGame.uuid}`);
    }
    setIsModalOpen(false);
  };

  const handleRematch = () => {
    setBoard(initialBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center gap-4">
        <div className="text-lg font-semibold mb-2 flex items-center flex-row gap-5">
          Current Player:{" "}
          {currentPlayer === "X" ? (
            <div>
              <img src="/X_bile.svg" alt="X" className="h-8 hidden dark:block" />
              <img src="/X_cerne.svg" alt="X" className="h-8 dark:hidden" />
            </div>
          ) : (
            <div>
              <img src="/O_bile.svg" alt="O" className="h-8 hidden dark:block" />
              <img src="/O_cerne.svg" alt="O" className="h-8 dark:hidden" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 border border-gray-600 p-2 rounded-lg">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((cell, cellIndex) => (
                <Button
                  key={`${rowIndex}-${cellIndex}`}
                  className="w-12 h-12 p-0 text-3xl"
                  variant={cell !== "" ? "default" : "outline"}
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {cell !== "" && (
                    <span
                      className="text-4xl"
                      aria-label={cell === "X" ? "X" : "O"}
                    >
                      {cell === "X" ? (
                        <div>
                          <img
                            src="/X_cerne.svg"
                            alt="X"
                            className="h-6 hidden dark:block"
                          />
                          <img
                            src="/X_bile.svg"
                            alt="X"
                            className="h-6 dark:hidden"
                          />
                        </div>
                      ) : (
                        <div>
                          <img
                            src="/O_cerne.svg"
                            alt="O"
                            className="h-6 hidden dark:block"
                          />
                          <img
                            src="/O_bile.svg"
                            alt="O"
                            className="h-6 dark:hidden"
                          />
                        </div>
                      )}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <VictoryModal
        isOpen={isModalOpen}
        onNextGame={handleNextGame}
        onRematch={handleRematch}
        onClose={handleCloseModal}
        winner={winner}
      />
    </div>
  );
};

export default Board;

