import { Game as GameType } from "@/types/gameTypes";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type GameCardProps = {
  game: GameType;
};

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/game/${game.uuid}`} className="block">
      <Card>
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
