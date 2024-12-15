"use client";

import Board from "@/components/custom/game/Board";
import { useParams } from "next/navigation";
import { useSpecificGame } from "@/queries/useSpecificGame";

export default function SpecificGame() {
  const gameParams = useParams<{ uuid: string }>();
  const { data: game, isLoading, isError, error } = useSpecificGame(gameParams.uuid);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex-1 p-8">
      {game && game.board && <Board initialBoard={game.board} />}
    </div>
  );
}
