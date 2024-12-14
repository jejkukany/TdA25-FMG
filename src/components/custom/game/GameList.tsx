import { Game as GameType } from "@/types/gameTypes";
import GameCard from "./GameCard";

type GameListProps = {
  games: GameType[];
};

export default function GameList({ games }: GameListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard key={game.uuid} game={game} />
      ))}
    </div>
  );
}
