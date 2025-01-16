"use client";
import Board from "@/components/custom/game/Board/Board";

export default function GamesPage() {
  return (
    <div className="2xl:px-4 w-full  flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
      <Board
        initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
      />
    </div>
  );
}
