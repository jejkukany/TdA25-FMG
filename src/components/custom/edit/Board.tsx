'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eraser, Save } from "lucide-react";
import { SaveGameDialog } from "../game/Board/SaveGameDialog";
import { updateGame } from "@/queries/useUpdateGame";
import { validateBoard } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

interface BoardProps {
  initialBoard: string[][];
  uuid: string;
  name: string;
  difficulty: string;
  startingPlayer: "X" | "O";
}

const Board: React.FC<BoardProps> = ({
  initialBoard,
  uuid,
  name,
  difficulty,
  startingPlayer,
}) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">(startingPlayer);
  const [winner, setWinner] = useState<"X" | "O" | null>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  console.log(errorMessage);

  const checkWinner = (board: string[][]): "X" | "O" | null => {
    const size = board.length;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 5; col++) {
        if (board[row].slice(col, col + 5).every((cell) => cell === "X")) {
          return "X";
        }
        if (board[row].slice(col, col + 5).every((cell) => cell === "O")) {
          return "O";
        }
      }
    }

    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 5; row++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col] === "X")) {
          return "X";
        }
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col] === "O")) {
          return "O";
        }
      }
    }

    for (let row = 0; row <= size - 5; row++) {
      for (let col = 0; col <= size - 5; col++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col + i] === "X")) {
          return "X";
        }
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col + i] === "O")) {
          return "O";
        }
      }
    }

    for (let row = 0; row <= size - 5; row++) {
      for (let col = 4; col < size; col++) {
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col - i] === "X")) {
          return "X";
        }
        if ([0, 1, 2, 3, 4].every((i) => board[row + i][col - i] === "O")) {
          return "O";
        }
      }
    }

    return null;
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((row) => [...row]); // Create a copy
      const xCount = newBoard.flat().filter((cell) => cell === "X").length;
      const oCount = newBoard.flat().filter((cell) => cell === "O").length;

      if (newBoard[rowIndex][cellIndex] === "X") {
        if (xCount <= oCount) {
          setErrorMessage("Invalid move: X must be placed.");
          return prevBoard;
        }
        newBoard[rowIndex][cellIndex] = "";
      } else if (newBoard[rowIndex][cellIndex] === "O") {
        if (oCount < xCount) {
          setErrorMessage("Invalid move: O must be placed.");
          return prevBoard;
        }
        newBoard[rowIndex][cellIndex] = "";
      } else if (newBoard[rowIndex][cellIndex] === "") {
        newBoard[rowIndex][cellIndex] = currentPlayer;
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }

      const newWinner = checkWinner(newBoard);
      setWinner(newWinner);

      setErrorMessage(null);
      return newBoard;
    });
  };

  const clearBoard = () => {
    const newBoard = board.map((row) => [...row]);
    newBoard.forEach((row) => row.fill(""));
    setBoard(newBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setErrorMessage("Cannot save an empty board");
  };

  const isBoardEmpty = (board: string[][]): boolean => {
    return board.flat().every((cell) => cell === "");
  };

  const saveGame = (name: string, difficulty: string) => {
    // Validate board before saving
    const validationError = validateBoard(board, currentPlayer);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (winner) {
      setErrorMessage("Cannot save because there is already a winner.");
      alert("Cannot save because there is already a winner.");
      return;
    } else if (isBoardEmpty(board)) {
      setErrorMessage("Cannot save an empty board.");
      return;
    } else {
      setErrorMessage(null);
    }

    router.push("/games");

    updateGame({
      uuid,
      board,
      difficulty,
      name,
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["game", uuid] });
    });
  };

  const isDisabled = !!winner || isBoardEmpty(board)

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 lg:gap-6 min-h-screen">
      <div className="flex flex-wrap rounded-lg border border-gray-400 w-full max-w-[80vh] aspect-square">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center ${rowIndex === 0 && cellIndex === 0
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
                <img src="/TDA/X_modre.svg" alt="X" className="w-3/4 h-3/4" />
              )}
              {cell === "O" && (
                <img src="/TDA/O_cervene.svg" alt="O" className="w-3/4 h-3/4" />
              )}
            </div>
          )),
        )}
      </div>

      <div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col lg:h-[80vh] lg:max-h-[80vh] lg:gap-2 mt-4 lg:mt-0">
        <Card className="mb-2">
          <CardHeader>
            <div className="text-xl sm:text-2xl font-bold text-center">

              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm sm:text-md">Current Player:</span>
                <div className="w-6 h-6 flex justify-center items-center">
                  {currentPlayer === "X" ? (
                    <img
                      src="/TDA/X_modre.svg"
                      alt="X"
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src="/TDA/O_cervene.svg"
                      alt="O"
                      className="w-full h-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="text-md font-bold flex flex-col space-y-2">
              <div className="items-center">
                <span>Clicking on either</span>
                <img src="/TDA/X_modre.svg" className="w-4 h-4 mx-1 inline-block" alt="X" />
                <span>or</span>
                <img src="/TDA/O_cervene.svg" className="w-4 h-4 mx-1 inline-block" alt="O" />
                <span>will replace the symbol with an empty space</span>
              </div>
              <div>
                Clicking on an empty space will place the Current Player symbol
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <ScrollArea className="flex-grow w-full p-4 h-[calc(100%-120px)]">
              {/* Moves list removed */}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full"
              onClick={() => clearBoard()}
              variant="outline"
            >
              <Eraser className="h-4 w-4 mr-2" />
              Clear Board
            </Button>
            <TooltipProvider>
              <Tooltip open={!!errorMessage}>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setIsSaveDialogOpen(true)}
                    variant="outline"
                    disabled={isDisabled}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Game
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{errorMessage}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>
      <SaveGameDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onSave={saveGame}
        defaultDifficulty={difficulty}
        defaultName={name}
      />
    </div>
  );
};

export default Board;
