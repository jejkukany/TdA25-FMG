"use client";

import Board from "@/components/custom/edit/Board";
import { useParams } from "next/navigation";
import { useSpecificGame } from "@/queries/useSpecificGame";

export default function SpecificGame() {
  const gameParams = useParams<{ uuid: string }>();
  const { data: game, isError, error } = useSpecificGame(gameParams.uuid);

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="2xl:px-4 w-full flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
      {game && game.board && (
        <Board
          initialBoard={game.board}
          uuid={gameParams.uuid}
          name={game.name}
          difficulty={game.difficulty}
          startingPlayer={game.currentPlayer}
        />
      )}
    </div>
  );
}
