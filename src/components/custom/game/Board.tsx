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
import { SaveGameDialog } from "@/components/custom/game/SaveGameDialog";

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
    <div className="flex flex-col items-center gap-6 2xl:px-8">
      <div className="flex flex-col xl:flex-row gap-6 w-full 2xl:px-0 px-3 justify-center ">
        {/* Board */}
        <div
          className="grid rounded-lg border border-gray-400 w-full max-w-screen-sm lg:max-w-screen-md aspect-square mx-auto xl:mx-0"
          style={{
            gridTemplateColumns: "repeat(15, 1fr)", // Define 15 equally sized columns
            gridTemplateRows: "repeat(15, 1fr)", // Define 15 equally sized rows
          }}
        >
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
                onClick={() => handleCellClick(rowIndex, cellIndex)}
              >
                {cell === "X" && (
                  <>
                    <img
                      src="/X_cerne.svg"
                      alt="X"
                      className="w-3/4 dark:hidden"
                    />
                    <img
                      src="/X_bile.svg"
                      alt="X"
                      className="w-3/4 hidden dark:block"
                    />
                  </>
                )}
                {cell === "O" && (
                  <>
                    <img
                      src="/O_cerne.svg"
                      alt="O"
                      className="w-3/4 dark:hidden"
                    />
                    <img
                      src="/O_bile.svg"
                      alt="O"
                      className="w-3/4 hidden dark:block"
                    />
                  </>
                )}
              </div>
            )),
          )}
        </div>

        {/* Moves and Save */}
        <div className="flex flex-col xl:w-1/5 max-w-screen-sm lg:max-w-screen-md  mx-auto xl:mx-0 w-full">
          <Card className="flex flex-col w-full mb-4">
            <CardHeader>
              <div className="text-2xl font-bold text-center">
                {winner ? (
                  <span className="text-green-600">Winner: {winner}</span>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-md">Current Player:</span>
                    <div className="w-6 h-6 flex justify-center align-middle items-center">
                      {currentPlayer === "X" ? (
                        <img
                          src="/X_cerne.svg"
                          alt="X"
                          className="w-full h-full dark:hidden"
                        />
                      ) : (
                        <img
                          src="/O_cerne.svg"
                          alt="O"
                          className="w-full h-full dark:hidden"
                        />
                      )}
                      {currentPlayer === "X" ? (
                        <img
                          src="/X_bile.svg"
                          alt="X"
                          className="w-full h-full hidden dark:block"
                        />
                      ) : (
                        <img
                          src="/O_bile.svg"
                          alt="O"
                          className="w-full h-full hidden dark:block"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>
          <Card className="flex flex-col w-full flex-grow">
            <CardHeader className="pb-2">
              <div className="text-lg font-bold">Moves:</div>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <ScrollArea className="h-[calc(100vh-400px)] w-full p-4 scroll">
                {moves.map((move, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {move.player === "X" ? (
                          <img
                            src="/X_cerne.svg"
                            alt="X"
                            className="w-full h-full dark:hidden"
                          />
                        ) : (
                          <img
                            src="/O_cerne.svg"
                            alt="O"
                            className="w-full h-full dark:hidden"
                          />
                        )}
                        {move.player === "X" ? (
                          <img
                            src="/X_bile.svg"
                            alt="X"
                            className="w-full h-full hidden dark:block"
                          />
                        ) : (
                          <img
                            src="/O_bile.svg"
                            alt="O"
                            className="w-full h-full hidden dark:block"
                          />
                        )}
                      </div>
                      <span className="text-sm">
                        played at ({move.position[0] + 1},{" "}
                        {move.position[1] + 1})
                      </span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
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
                className="w-1/2"
                onClick={() => setIsSaveDialogOpen(true)}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Game
              </Button>
            </CardFooter>
          </Card>
        </div>
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
