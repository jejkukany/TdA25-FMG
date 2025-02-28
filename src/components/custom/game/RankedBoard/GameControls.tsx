"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Handshake } from "lucide-react";

interface GameControlsProps {
  currentPlayer: "X" | "O";
  moves: { player: "X" | "O"; position: [number, number] }[];
  drawProposed: boolean;
  drawProposedBy: "X" | "O" | null;
  onProposeDrawClick: () => void;
  onResignClick: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  moves,
  drawProposed,
  drawProposedBy,
  onProposeDrawClick,
  onResignClick,
}) => {
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-4">
          <div className="text-xl font-bold text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm">Current Player:</span>
              <div className="w-6 h-6 flex justify-center items-center">
                {currentPlayer === "X" ? (
                  <img src="/TDA/X_modre.svg" alt="X" className="w-full h-full" />
                ) : (
                  <img src="/TDA/O_cervene.svg" alt="O" className="w-full h-full" />
                )}
              </div>
            </div>
            {drawProposed && (
              <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                {drawProposedBy === currentPlayer
                  ? "Draw proposed. Waiting for opponent..."
                  : "Opponent proposed a draw. Accept?"}
              </div>
            )}
          </div>
          <div className="pt-2 border-t">
            <div className="text-lg font-bold">Moves:</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="w-full p-4 h-[calc(100%-120px)] min-h-[200px]">
          {moves.map((move, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  {move.player === "X" ? (
                    <img src="/TDA/X_modre.svg" alt="X" className="w-full h-full" />
                  ) : (
                    <img src="/TDA/O_cervene.svg" alt="O" className="w-full h-full" />
                  )}
                </div>
                <span className="text-sm">
                  ({move.position[0] + 1}, {move.position[1] + 1})
                </span>
              </div>
            </div>
          ))}
          {moves.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No moves yet
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 pt-2 border-t mt-auto">
        <div className="text-lg font-bold w-full mb-1">Game Actions</div>
        <Button
          variant="outline"
          onClick={onProposeDrawClick}
          className="flex items-center justify-center w-full"
        >
          <Handshake className="h-4 w-4 mr-2" />
          {drawProposed && drawProposedBy !== currentPlayer
            ? "Accept Draw"
            : "Propose Draw"}
        </Button>
        <Button
          variant="destructive"
          onClick={onResignClick}
          className="flex items-center justify-center w-full"
        >
          <Flag className="h-4 w-4 mr-2" />
          Resign
        </Button>
      </CardFooter>
    </Card>
  );
};