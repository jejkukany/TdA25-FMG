"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { VictoryModal } from "./VictoryModal";
import { useNextGame } from "@/queries/useNextGame";
import { useParams, useRouter } from "next/navigation";
import { addGame } from "@/queries/useCreateGame";
import { SaveGameDialog } from "./SaveGameDialog";

interface BoardProps {
  initialBoard: string[][];
}

const Board: React.FC<BoardProps> = ({ initialBoard }) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [moves, setMoves] = useState<
    { player: "X" | "O"; position: [number, number] }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const nextGameParams = useParams<{ uuid: string }>();
  const router = useRouter();

  const { data: nextGame } = useNextGame(nextGameParams.uuid);

  const checkWinner = (board: string[][], symbol: string): boolean => {
    const size = board.length;

    // Check rows
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 5; col++) {
        if (board[row].slice(col, col + 5).every((cell) => cell === symbol)) {
          return true;
        }
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 5; row++) {
        if (board.slice(row, row + 5).every((r) => r[col] === symbol)) {
          return true;
        }
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row <= size - 5; row++) {
      for (let col = 0; col <= size - 5; col++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col + i] === symbol)) {
          return true;
        }
      }
    }

    // Check diagonals (top-right to bottom-left)
    for (let row = 0; row <= size - 5; row++) {
      for (let col = 4; col < size; col++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col - i] === symbol)) {
          return true;
        }
      }
    }

    return false;
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    if (board[rowIndex][cellIndex] !== "" || winner) {
      return;
    }

    const newBoard = board.map((row, rIndex) =>
      row.map((cell, cIndex) =>
        rIndex === rowIndex && cIndex === cellIndex ? currentPlayer : cell,
      ),
    );

    setBoard(newBoard);
    setMoves((prevMoves) => [
      ...prevMoves,
      { player: currentPlayer, position: [rowIndex, cellIndex] },
    ]);

    if (checkWinner(newBoard, currentPlayer)) {
      setWinner(currentPlayer);
      setIsModalOpen(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const returnPlay = (index: number) => {
    if (index < 0 || index >= moves.length) return;

    const newMoves = moves.slice(0, index + 1);
    const newBoard = initialBoard.map((row) => [...row]);

    newMoves.forEach(({ player, position }) => {
      newBoard[position[0]][position[1]] = player;
    });

    setBoard(newBoard);
    setMoves(newMoves);
    setCurrentPlayer(newMoves.length % 2 === 0 ? "X" : "O");
    setWinner(null);
  };

  const saveGame = (name: string, difficulty: string) => {
    return addGame({
      board: board,
      difficulty: difficulty,
      name: name,
    });
  };

  const handleNextGame = () => {
    if (nextGame) {
      router.push(`/game/${nextGame.uuid}`);
    }
    setIsModalOpen(false);
  };

  const handleRematch = () => {
    setBoard(initialBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setMoves([]);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center max-h-screen justify-center p-4 sm:p-6 lg:p-8 lg:gap-6 my-auto">
      {/* Board */}
      <div className="flex flex-wrap rounded-lg border border-gray-400 h-[50%] w-full sm:w-[100%] md:w-[100%] lg:w-[60%] xl:max-w-screen-md aspect-square flex-1">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center ${
                rowIndex === 0 && cellIndex === 0
                  ? "rounded-tl-md"
                  : rowIndex === 0 && cellIndex === 14
                    ? "rounded-tr-md"
                    : rowIndex === 14 && cellIndex === 0
                      ? "rounded-bl-md"
                      : rowIndex === 14 && cellIndex === 14
                        ? "rounded-br-md"
                        : ""
              }`}
              style={{
                flexBasis: `${100 / 15}%`,
                height: `calc(100% / 15)`,
              }}
              onClick={() => handleCellClick(rowIndex, cellIndex)}
            >
              {cell === "X" && (
                <img src="/X_modre.svg" alt="X" className="w-3/4 h-3/4" />
              )}
              {cell === "O" && (
                <img src="/O_cervene.svg" alt="O" className="w-3/4 h-3/4" />
              )}
            </div>
          )),
        )}
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col lg:my-auto lg:gap-2 max-h-screen">
        <Card className="flex-1">
          <CardHeader>
            <div className="text-xl sm:text-2xl font-bold text-center">
              {winner ? (
                <span className="text-green-600">Winner: {winner}</span>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm sm:text-md">Current Player:</span>
                  <div className="w-6 h-6 flex justify-center items-center">
                    {currentPlayer === "X" ? (
                      <img
                        src="/X_modre.svg"
                        alt="X"
                        className="w-full h-full"
                      />
                    ) : (
                      <img
                        src="/O_cervene.svg"
                        alt="O"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
        <Card className="flex flex-col flex-1">
          <CardHeader className="pb-2">
            <div className="text-lg font-bold">Moves:</div>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <ScrollArea className="flex-1 w-full p-4 scroll ">
              {moves.map((move, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {move.player === "X" ? (
                        <img
                          src="/X_modre.svg"
                          alt="X"
                          className="w-full h-full"
                        />
                      ) : (
                        <img
                          src="/O_cervene.svg"
                          alt="O"
                          className="w-full h-full"
                        />
                      )}
                    </div>
                    <span className="text-sm">
                      played at ({move.position[0] + 1}, {move.position[1] + 1})
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                size="icon"
                onClick={() => returnPlay(moves.length - 2)}
                disabled={moves.length <= 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => returnPlay(moves.length)}
                disabled={
                  moves.length === 0 ||
                  moves.length === board.flat().filter(Boolean).length
                }
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="w-full"
              onClick={() => setIsSaveDialogOpen(true)}
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Game
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isModalOpen && (
        <VictoryModal
          isOpen={isModalOpen}
          onNextGame={handleNextGame}
          onRematch={handleRematch}
          onClose={handleCloseModal}
          winner={winner}
        />
      )}
      <SaveGameDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={saveGame}
      />
    </div>
  );
};

export default Board;
