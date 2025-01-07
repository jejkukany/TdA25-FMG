"use client";
import Board from "@/components/custom/game/Board";

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Board
        initialBoard={Array.from({ length: 15 }, () => Array(15).fill(""))}
      />
    </div>
  );
}
