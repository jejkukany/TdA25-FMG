"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Game } from "@/types/gameTypes";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { fetchSpecificGame } from "@/queries/useSpecificGame";
import BoardCardPreview from "./BoardCardPreview";
import DifficultyIcon from "./DifficultyIcon";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Pencil, TrashIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteGame } from "@/queries/useDeleteGame";

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

  const { mutate: deleteGame } = useDeleteGame();

  const handleDelete = () => {
    deleteGame({ uuid: game.uuid });
  };
  return (
    <div className="block w-full lg:max-w-72">
      <Card
        onMouseEnter={handleMouseEnter}
        className="h-full transition-shadow hover:shadow-md p-0"
      >
        <div className="flex justify-center">
          <BoardCardPreview board={game.board} />
        </div>
        <CardContent className="pt-2">
          <CardTitle className="text-lg font-medium  text-foreground flex flex-row justify-between items-center">
            <p className="truncate">{game.name}</p>
            <span className="flex flex-row gap-3">
              <p className="text-md text-primary">
                {game.gameState.charAt(0).toUpperCase() +
                  game.gameState.slice(1)}
              </p>
              <DifficultyIcon difficulty={game.difficulty} />
            </span>
          </CardTitle>
        </CardContent>
        <CardFooter className="flex flex-row gap-1 justify-between">
          <Link href={`/game/${game.uuid}`} className="w-3/4">
            <Button className="w-full">Play</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-1/4" variant={"outline"}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <Link href={`/edit/${game.uuid}`}>
                <DropdownMenuItem>
                  <Pencil /> Edit
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete()}
              >
                <TrashIcon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </div>
  );
}
