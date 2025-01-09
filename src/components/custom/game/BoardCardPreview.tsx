import { BoardState } from "@/types/gameTypes";
import clsx from "clsx";
import React from "react";

const BoardCardPreview = ({ board }: { board: BoardState | null }) => {
  if (!board) return null;

  return (
    <div className="w-full max-w-[240px] aspect-square mx-auto">
      <div
        className="grid border border-gray-400 mx-auto w-full max-w-sm rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: "repeat(15, 1fr)",
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={clsx(
                cell !== "" && "bg-",
                "border border-gray-300 flex items-center justify-center aspect-square",
                rowIndex === 0 && cellIndex === 0
                  ? "rounded-tl-[7px]"
                  : rowIndex === 0 && cellIndex === 14
                    ? "rounded-tr-[7px]"
                    : rowIndex === 14 && cellIndex === 0
                      ? "rounded-bl-[7px]"
                      : rowIndex === 14 && cellIndex === 14
                        ? "rounded-br-[7px]"
                        : "",
              )}
            >
              {cell !== "" && (
                <span
                  className="w-full h-full p-[3px]"
                  aria-label={cell === "X" ? "X" : "O"}
                >
                  {cell === "X" ? (
                    <>
                      <img src="/X_cerne.svg" alt="X" className="dark:hidden" />
                      <img
                        src="/X_bile.svg"
                        alt="X"
                        className="hidden dark:block"
                      />
                    </>
                  ) : (
                    <>
                      <img src="/O_cerne.svg" alt="O" className="dark:hidden" />
                      <img
                        src="/O_bile.svg"
                        alt="O"
                        className="hidden dark:block"
                      />
                    </>
                  )}
                </span>
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default BoardCardPreview;
