"use client";

import GameList from "@/components/custom/game/GameList";
import { useGames } from "@/queries/useGames";

export default function GamesPage() {
  const { data: games, isPending, isError, error } = useGames();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Current Games</h1>
      <GameList games={games} />
    </div>
  );
}
