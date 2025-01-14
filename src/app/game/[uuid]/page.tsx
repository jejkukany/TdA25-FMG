"use client";

import Board from "@/components/custom/game/Board";
import { useParams } from "next/navigation";
import { useSpecificGame } from "@/queries/useSpecificGame";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SpecificGame() {
  const gameParams = useParams<{ uuid: string }>();
  const {
    data: game,
    isLoading,
    isError,
    error,
  } = useSpecificGame(gameParams.uuid);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="flex-1 p-8">
      <Link href={"/games"}>
        <Button variant={"outline"}>
          <ArrowLeft />
        </Button>
      </Link>
      {game && game.board && <Board initialBoard={game.board} />}
    </div>
  );
}
