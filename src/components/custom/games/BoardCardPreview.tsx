import React from "react";
import { BoardState } from "@/types/gameTypes";

const BoardCardPreview: React.FC<{ board: BoardState | null }> = ({
  board,
}) => {
  if (!board) return null;

  return (
    <div className="w-full aspect-square mx-auto">
      <div className="flex flex-wrap w-full aspect-square shadow-sm">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center ${
                rowIndex === 0 && cellIndex === 0
                  ? "rounded-tl-[0.69em]"
                  : rowIndex === 0 && cellIndex === 14
                    ? "rounded-tr-[0.69em]"
                    : rowIndex === 14 && cellIndex === 0
              }`}
              style={{
                flexBasis: `${100 / 15}%`,
                height: `calc(100% / 15)`,
              }}
            >
              {cell === "X" && (
                <img src="/TDA/X_modre.svg" alt="X" className="w-3/4 h-3/4" />
              )}
              {cell === "O" && (
                <img src="/TDA/O_cervene.svg" alt="O" className="w-3/4 h-3/4" />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default BoardCardPreview;
