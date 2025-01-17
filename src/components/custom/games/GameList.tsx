import React from "react";
import GameCard from "./GameCard";
import { Game } from "@/types/gameTypes";

interface GameListProps {
  games: Game[];
}

const GameList: React.FC<GameListProps> = ({ games }) => {
  return (
    <div className="flex flex-wrap justify-start gap-4">
      {games.map((game) => (
        <GameCard key={game.uuid} game={game} />
      ))}
    </div>
  );
};

export default GameList;
