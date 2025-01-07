"use client";
import GameList from "@/components/custom/game/GameList";
import { Button } from "@/components/ui/button";
import { useCreateGames } from "@/queries/useCreateGame";
import { useGames } from "@/queries/useGames";
import React from "react";

const Games = () => {
  const { data: games, isPending, isError, error } = useGames();
  const { mutate } = useCreateGames();
  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-row justify-between">
        <h1 className="text-3xl font-bold">Games</h1>
        <Button
          className="font-bold"
          onClick={() =>
            mutate({
              name: "Test",
              difficulty: "easy",
            })
          }
        >
          Add Game
        </Button>
      </div>
      <GameList games={games} />
    </div>
  );
};

export default Games;
