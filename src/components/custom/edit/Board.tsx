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
import { Save } from "lucide-react";
import { SaveGameDialog } from "../game/Board/SaveGameDialog";
import { updateGame } from "@/queries/useUpdateGame";
import { validateBoard } from "@/lib/utils"; // Import the validateBoard function

interface BoardProps {
  initialBoard: string[][];
  uuid: string;
  name: string;
  difficulty: string;
}

const Board: React.FC<BoardProps> = ({
  initialBoard,
  uuid,
  name,
  difficulty,
}) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state

  const checkWinner = (board: string[][]): string | null => {
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

  const getCurrentPlayer = () => {
    const xCount = board.flat().filter((cell) => cell === "X").length;
    const oCount = board.flat().filter((cell) => cell === "O").length;

    return xCount > oCount ? "O" : "X"; // X goes first, if counts are equal or O has fewer, it's X's turn
  };

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    const currentPlayer = getCurrentPlayer();
    const newBoard = [...board];
    const currentValue = newBoard[rowIndex][cellIndex];

    if (currentValue === "") {
      newBoard[rowIndex][cellIndex] = currentPlayer; // Place current player's mark
    } else if (currentValue === "X") {
      newBoard[rowIndex][cellIndex] = "O"; // Toggle between X and O
    } else {
      newBoard[rowIndex][cellIndex] = ""; // Reset to empty
    }

    setBoard(newBoard);

    // Validate the board after the move
    const validationError = validateBoard(newBoard, currentPlayer);
    if (validationError) {
      setErrorMessage(validationError); // Set the error message if board is invalid
    } else {
      setErrorMessage(null); // Clear error message if validation passes
    }
  };

  const saveGame = (name: string, difficulty: string) => {
    // Validate board before saving
    const validationError = validateBoard(board, getCurrentPlayer());
    if (validationError) {
      setErrorMessage(validationError); // Set the error message if board is invalid
      return;
    }

    const winner = checkWinner(board);
    if (winner) {
      alert("Board is invalid because there is already a winner.");
      return;
    }

    // If validation passes, update the game
    setErrorMessage(null); // Clear error message if validation passes
    return updateGame({
      uuid: uuid,
      board: board,
      difficulty: difficulty,
      name: name,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 lg:gap-6 min-h-screen">
      <div className="flex flex-wrap rounded-lg border border-gray-400 w-full max-w-[80vh] aspect-square">
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
        <Card className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="text-lg font-bold">Moves:</div>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <ScrollArea className="flex-grow w-full p-4 h-[calc(100%-120px)]">
              {/* No moves list for now since no moves tracking */}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="w-full"
                    onClick={() => setIsSaveDialogOpen(true)}
                    variant="outline"
                    disabled={!!errorMessage} // Disable button if there is an error
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Game
                  </Button>
                </TooltipTrigger>
                {errorMessage && (
                  <TooltipContent>
                    <p>Invalid Board</p>
                  </TooltipContent>
                )}
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
