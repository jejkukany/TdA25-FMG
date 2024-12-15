'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Game as GameType } from "@/types/gameTypes";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchSpecificGame } from "@/queries/useSpecificGame";

type GameCardProps = {
  game: GameType;
};

export default function GameCard({ game }: GameCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    const cachedData = queryClient.getQueryData(['game', game.uuid]);

    if (!cachedData) {
      queryClient.prefetchQuery({
        queryKey: ['game', game.uuid],
        queryFn: () => fetchSpecificGame(game.uuid),
      });
    }
  };

  return (
    <Link href={`/game/${game.uuid}`} className="block">
      <Card onMouseEnter={handleMouseEnter}>
        <CardHeader>
          <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-2">Difficulty: {game.difficulty}</p>
          <p className="text-gray-600 mb-2">State: {game.gameState}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

