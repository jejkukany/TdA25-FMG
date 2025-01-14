"use client";
import Board from "@/components/custom/game/Board";

export default function GamesPage() {
  return (
    <div className="2xl:px-4 w-full h-screen flex flex-col justify-center 2xl:mt-[-28px]">
      <Board
        initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
      />
    </div>
  );
}
