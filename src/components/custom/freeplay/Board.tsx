"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flag, Equal } from "lucide-react";
import { VictoryModal } from "./VictoryModal";
import { SurrenderDialog } from "./SurrenderDialog";
import { socket } from "@/socket";
import { TieDialog } from "./TieDialog";
import { RematchDialog } from "./RematchDialog";

interface BoardProps {
  initialBoard: string[][];
  playerSymbol: "X" | "O";
  playerName?: string;
  opponentName?: string;
}

const Board: React.FC<BoardProps> = ({ initialBoard, playerSymbol, playerName = "You", opponentName = "Guest" }) => {
  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
  const [moves, setMoves] = useState<
    { player: "X" | "O"; position: [number, number] }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(playerSymbol === "X");
  const [showSurrenderDialog, setShowSurrenderDialog] = useState(false);
  const [showTieDialog, setShowTieDialog] = useState(false);
  const [isTieOffered, setIsTieOffered] = useState(false);
  const [isWaitingForRematch, setIsWaitingForRematch] = useState(false);
  const [showRematchDialog, setShowRematchDialog] = useState(false);

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

  const isBoardFull = (board: string[][]): boolean => {
    return board.every(row => row.every(cell => cell !== ""));
  };
  
  useEffect(() => {
    // Listen for game state updates from server
    socket.on("gameState", ({ board: updatedBoard, currentPlayer: updatedPlayer }) => {
      // Only update if the board has changed
      if (JSON.stringify(updatedBoard) !== JSON.stringify(board)) {
        setBoard(updatedBoard);
        
        // Find what changed to add to moves history
        for (let rowIndex = 0; rowIndex < updatedBoard.length; rowIndex++) {
          for (let cellIndex = 0; cellIndex < updatedBoard[rowIndex].length; cellIndex++) {
            if (updatedBoard[rowIndex][cellIndex] !== "" && 
                board[rowIndex][cellIndex] === "") {
              // This is the new move
              setMoves((prevMoves) => [
                ...prevMoves,
                { player: updatedBoard[rowIndex][cellIndex], position: [rowIndex, cellIndex] },
              ]);
              break;
            }
          }
        }
        
        // Check for winner after move
        if (checkWinner(updatedBoard, "X")) {
          setWinner("X");
          setIsModalOpen(true);
        } else if (checkWinner(updatedBoard, "O")) {
          setWinner("O");
          setIsModalOpen(true);
        } else if (isBoardFull(updatedBoard)) {
          setWinner("draw");
          setIsModalOpen(true);
        }
      }
      
      // Update current player and turn status
      setCurrentPlayer(updatedPlayer);
      setIsYourTurn(playerSymbol === updatedPlayer);
    });
    
    // Listen for player left event
    socket.on("playerLeft", ({ board: updatedBoard, currentPlayer: updatedPlayer, message }) => {
      alert(message || "Your opponent has left the game.");
      setBoard(updatedBoard);
      setCurrentPlayer(updatedPlayer);
      setWinner(currentPlayer);
      setIsModalOpen(true);
    });
    
    // Listen for player surrendered event
    socket.on("playerSurrendered", ({ winner }) => {
      alert("Your opponent has surrendered!");
      setWinner(winner);
      setIsModalOpen(true);
    });

    // Listen for tie offered event
    socket.on("tieOffered", () => {
      setIsTieOffered(false); // We're receiving the offer, not making it
      setShowTieDialog(true);
      alert("Your opponent has offered a tie.");
    });

    // Listen for tie accepted event
    socket.on("tieAccepted", () => {
      setWinner("draw");
      setIsModalOpen(true);
      alert("Your opponent has accepted the tie offer.");
    });

    // Listen for rematch request sent confirmation
    socket.on("rematchRequestSent", () => {
      setIsWaitingForRematch(true);
      console.log("Rematch request sent, waiting for opponent...");
    });

    // Listen for rematch request
    socket.on("rematchRequested", () => {
      setShowRematchDialog(true);
    });

    // Listen for rematch accepted
    socket.on("rematchAccepted", ({ startingPlayer }) => {
      // Reset the game with the new starting player
      setBoard(initialBoard);
      setCurrentPlayer(startingPlayer);
      setWinner(null);
      setMoves([]);
      setIsModalOpen(false);
      setIsWaitingForRematch(false);
      setIsYourTurn(playerSymbol === startingPlayer);
    });

    // Listen for rematch declined
    socket.on("rematchDeclined", () => {
      setIsWaitingForRematch(false);
      setIsModalOpen(false); // Close the victory modal
      alert("Your opponent declined the rematch request.");
    });
    
    return () => {
      socket.off("gameState");
      socket.off("playerLeft");
      socket.off("playerSurrendered");
      socket.off("tieOffered");
      socket.off("tieAccepted");
      socket.off("rematchRequestSent");
      socket.off("rematchRequested");
      socket.off("rematchAccepted");
      socket.off("rematchDeclined");
    };
  }, [board, playerSymbol, initialBoard, currentPlayer]);

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
    // Check if it's your turn and the cell is empty
    if (!isYourTurn || board[rowIndex][cellIndex] !== "" || winner) {
      return;
    }
  
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }
    
    // Send move to server - the server will update the game state
    socket.emit("makeMove", {
      gameId,
      row: rowIndex,
      col: cellIndex
    });
  };

  const handleSurrender = () => {
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }
    
    // Send surrender event to server
    socket.emit("surrender", { gameId });
    setShowSurrenderDialog(false);
    
    // Don't update local state here
    // Let the server broadcast the updated game state to all players
    // The playerSurrendered event handler will update the state for both players
  }

  const handleOfferTie = () => {
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }
    
    // Send tie offer to server
    socket.emit("offerTie", { gameId });
    setShowTieDialog(false);
    console.log("Tie offered");
  };
  
  const handleAcceptTie = () => {
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }
    
    // Send accept tie to server
    socket.emit("acceptTie", { gameId });
    setShowTieDialog(false);
    console.log("Tie accepted");
  };

  const handleRematch = () => {
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }

    // Send rematch request to server
    socket.emit("requestRematch", { gameId });
    setIsWaitingForRematch(true);
  };

  const handleAcceptRematch = () => {
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }

    // Calculate the new starting player (opposite of the previous game's starter)
    const newStartingPlayer = playerSymbol === "X" ? "O" : "X";

    // Send accept rematch to server
    socket.emit("acceptRematch", { gameId, startingPlayer: newStartingPlayer });
    setShowRematchDialog(false);
  };

  const handleDeclineRematch = () => {
    // Get the room ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('room');
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }

    // Send decline rematch to server
    socket.emit("declineRematch", { gameId });
    setShowRematchDialog(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 lg:gap-6 min-h-screen">
      <div className="flex flex-col w-full max-w-[80vh]">
        {/* Players info section above the board */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{playerName}</span>
            <div className="w-6 h-6 flex justify-center items-center">
              <img
                src={`/TDA/${playerSymbol === "X" ? "X_modre.svg" : "O_cervene.svg"}`}
                alt={playerSymbol}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 flex justify-center items-center">
              <img
                src={`/TDA/${playerSymbol === "X" ? "O_cervene.svg" : "X_modre.svg"}`}
                alt={playerSymbol === "X" ? "O" : "X"}
                className="w-full h-full"
              />
            </div>
            <span className="font-medium">{opponentName}</span>
          </div>
        </div>
        
        {/* Board */}
        <div className="flex flex-wrap rounded-lg border border-gray-400 w-full aspect-square">
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
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col lg:h-[80vh] lg:max-h-[80vh] lg:gap-2 mt-4 lg:mt-0">
        <Card className="mb-2">
          <CardHeader>
            <div className="text-xl sm:text-2xl font-bold text-center">
              {winner ? (
                <span className="text-green-600">Winner: {winner}</span>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2">
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
                  <div className="mt-2 text-sm font-medium">
                    {isYourTurn ? (
                      <span className="text-green-600">Your turn</span>
                    ) : (
                      <span className="text-amber-600">Opponent&apos;s turn</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
        <Card className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="text-lg font-bold">Moves:</div>
          </CardHeader>
          <CardContent className="flex-grow p-0">
            <ScrollArea className="flex-grow w-full p-4 h-[calc(100%-120px)]">
              {moves.map((move, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {move.player === "X" ? (
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
                    <span className="text-sm">
                      ({move.position[0] + 1}, {move.position[1] + 1})
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              className="w-full"
              onClick={() => setShowSurrenderDialog(true)}
              variant="outline"
            >
              <Flag className="h-4 w-4 mr-2" />
              Surrender
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setIsTieOffered(true);
                setShowTieDialog(true);
              }}
              variant="outline"
            >
              <Equal className="h-4 w-4 mr-2" />
              Offer Tie
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isModalOpen && (
        <VictoryModal
          isOpen={isModalOpen}
          onRematch={handleRematch}
          onClose={handleCloseModal}
          result={winner}
          isWaitingForRematch={isWaitingForRematch}
        />
      )}
      <SurrenderDialog
        isOpen={showSurrenderDialog}
        onClose={() => setShowSurrenderDialog(false)}
        onSurrender={handleSurrender}
      />
      <TieDialog
        isOpen={showTieDialog}
        onClose={() => setShowTieDialog(false)}
        onConfirmTie={isTieOffered ? handleOfferTie : handleAcceptTie}
        isOffering={isTieOffered}
      />
      <RematchDialog
        isOpen={showRematchDialog}
        onClose={() => setShowRematchDialog(false)}
        onAcceptRematch={handleAcceptRematch}
        onDeclineRematch={handleDeclineRematch}
      />
    </div>
  );
};

export default Board;