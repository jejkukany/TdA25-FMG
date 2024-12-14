"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface BoardProps {
  initialBoard: string[][];
}

const Board: React.FC<BoardProps> = ({ initialBoard }) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (board[rowIndex][cellIndex] !== "") {
      return;
    }

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === cellIndex ? currentPlayer : cell,
      ),
    );

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-lg font-semibold mb-2 flex items center flex-row gap-5">
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
      <div className="flex flex-col gap-2">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, cellIndex) => (
              <Button
                key={`${rowIndex}-${cellIndex}`}
                className="w-16 h-16 p-0 text-3xl"
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
                          src="/X_bile.svg"
                          alt="X"
                          className="h-8 dark:hidden"
                        />
                        <img
                          src="/X_cerne.svg"
                          alt="X"
                          className="h-8 hidden dark:block"
                        />
                      </div>
                    ) : (
                      <div>
                        <img
                          src="/O_bile.svg"
                          alt="O"
                          className="h-8 dark:hidden"
                        />
                        <img
                          src="/O_cerne.svg"
                          alt="O"
                          className="h-8 hidden dark:block"
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
  );
};

export default Board;
