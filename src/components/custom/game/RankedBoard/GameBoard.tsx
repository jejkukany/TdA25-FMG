"use client";

import React from "react";

interface GameBoardProps {
  board: string[][];
  onCellClick: (rowIndex: number, cellIndex: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ board, onCellClick }) => {
  return (
    <div className="flex flex-wrap rounded-lg border border-gray-400 w-full aspect-square">
      {board.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center ${
              rowIndex === 0 && cellIndex === 0
                ? "rounded-tl-md"
                : rowIndex === 0 && cellIndex === 14
                ? "rounded-tr-md"
                : rowIndex === 14 && cellIndex === 0
                ? "rounded-bl-md"
                : rowIndex === 14 && cellIndex === 14
                ? "rounded-br-md"
                : ""
            }`}
            style={{
              flexBasis: `${100 / 15}%`,
              height: `calc(100% / 15)`,
            }}
            onClick={() => onCellClick(rowIndex, cellIndex)}
          >
            {cell === "X" && (
              <img
                src="/TDA/X_modre.svg"
                alt="X"
                className="w-3/4 h-3/4"
              />
            )}
            {cell === "O" && (
              <img
                src="/TDA/O_cervene.svg"
                alt="O"
                className="w-3/4 h-3/4"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};