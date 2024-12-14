"use client";

import { useEffect, useState } from "react";
import { Game as GameType } from "@/types/gameTypes";
import GameList from "@/components/custom/game/GameList";

export default function GamesPage() {
  const [games, setGames] = useState<GameType[]>();

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/v1/games/");
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  if (!games) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Current Games</h1>
      <GameList games={games} />
    </div>
  );
}
