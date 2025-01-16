"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Game } from "@/types/gameTypes";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSpecificGame } from "@/queries/useSpecificGame";
import BoardCardPreview from "./Board/BoardCardPreview";

type GameCardProps = {
  game: Game;
};

export default function GameCard({ game }: GameCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    const cachedData = queryClient.getQueryData(["game", game.uuid]);

    if (!cachedData) {
      queryClient.prefetchQuery({
        queryKey: ["game", game.uuid],
        queryFn: () => fetchSpecificGame(game.uuid),
      });
    }
  };

  return (
    <Link href={`/game/${game.uuid}`} className="block">
      <Card
        onMouseEnter={handleMouseEnter}
        className="h-full transition-shadow hover:shadow-md"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium line-clamp-1">
            {game.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex justify-center">
            <BoardCardPreview board={game.board} />
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Difficulty: {game.difficulty}</p>
            <p>State: {game.gameState}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
