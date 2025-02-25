"use client";

import Board from "@/components/custom/games/Board";
import { useParams } from "next/navigation";
import { useSpecificGame } from "@/queries/useSpecificGame";

export default function SpecificGame() {
  const gameParams = useParams<{ uuid: string }>();
  const { data: game, isError, error } = useSpecificGame(gameParams.uuid);

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex-1">
      {game && game.board && <Board initialBoard={game.board} startingPlayer={game.currentPlayer} nextGame={game.nextGameUuid}/>}
    </div>
  );
}
