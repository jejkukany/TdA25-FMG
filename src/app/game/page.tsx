import { Game as GameType } from "@/types/gameTypes";
import GameList from "@/components/custom/game/GameList";

async function getGames(): Promise<GameType[]> {
  const res = await fetch("http://localhost:3000/api/v1/games/", {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch games");
  }

  return res.json();
}

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Current Games</h1>
      <GameList games={games} />
    </div>
  );
}
