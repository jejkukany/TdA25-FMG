"use client";

import { useEffect, useState } from "react";
import Board from "@/components/custom/game/Board";
import { Game as GameType } from "@/types/gameTypes";
import { useParams } from "next/navigation";

export default function SpecificGame() {
  const [game, setGame] = useState<GameType | null>(null);
  const gameParams = useParams<{ uuid: string }>();

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/v1/games/${gameParams.uuid}`);

      const data = (await response.json()) as GameType;
      setGame(data);
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  useEffect(() => {
    fetchGame();
  }, []);

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-8">
      {game.board && <Board initialBoard={game.board} />}
    </div>
  );
}
