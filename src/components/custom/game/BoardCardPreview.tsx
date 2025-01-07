import { BoardState } from "@/types/gameTypes";
import clsx from "clsx";
import React from "react";

const BoardCardPreview = ({ board }: { board: BoardState | null }) => {
  if (!board) return null;

  return (
    <div className="w-full max-w-[240px] aspect-square mx-auto">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[1px] flex-row">
          {row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={clsx(
                cell !== "" && "bg-foreground",
                "flex-1 aspect-square flex items-center justify-center border border-input bg-background shadow-sm rounded-sm",
              )}
            >
              {cell !== "" && (
                <span
                  className="w-full h-full p-[3px]"
                  aria-label={cell === "X" ? "X" : "O"}
                >
                  {cell === "X" ? (
                    <>
                      <img
                        src="/X_cerne.svg"
                        alt="X"
                        className="w-full h-full hidden dark:block"
                      />
                      <img
                        src="/X_bile.svg"
                        alt="X"
                        className="w-full h-full dark:hidden"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src="/O_cerne.svg"
                        alt="O"
                        className="w-full h-full hidden dark:block"
                      />
                      <img
                        src="/O_bile.svg"
                        alt="O"
                        className="w-full h-full dark:hidden"
                      />
                    </>
                  )}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default BoardCardPreview;
