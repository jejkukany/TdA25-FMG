"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameResultProps {
  winner: "player1" | "player2" | "draw" | null;
  player1Name: string;
  player2Name: string;
  onRematch: () => void;
  onFindNewMatch: () => void;
}

export const GameResult: React.FC<GameResultProps> = ({
  winner,
  player1Name,
  player2Name,
  onRematch,
  onFindNewMatch,
}) => {
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {winner === "draw"
              ? "Game Ended in a Draw"
              : `${winner === "player1" ? player1Name : player2Name} Won!`}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button onClick={onRematch} variant="default">
            Rematch (Switch Sides)
          </Button>
          <Button onClick={onFindNewMatch} variant="outline">
            Find New Match
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};