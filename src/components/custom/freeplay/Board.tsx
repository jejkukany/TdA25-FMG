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
import { VictoryModal } from "@/components/custom/game/Board/VictoryModal";
import { addGame } from "@/queries/useCreateGame";
import { SaveGameDialog } from "@/components/custom/game/Board/SaveGameDialog";
import { useRouter } from "next/navigation";
import { socket } from "@/socket";
import { Flag, Handshake } from "lucide-react";

interface BoardProps {
	initialBoard: string[][];
	playerSymbol: "X" | "O";
}

const Board: React.FC<BoardProps> = ({ initialBoard, playerSymbol }) => {
	const [board, setBoard] = useState<string[][]>(initialBoard);
	const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
	const [winner, setWinner] = useState<"X" | "O" | "draw" | null>(null);
	const [moves, setMoves] = useState<
		{ player: "X" | "O"; position: [number, number] }[]
	>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
	const [isYourTurn, setIsYourTurn] = useState(playerSymbol === "X");
	const router = useRouter();

	const checkWinner = (board: string[][], symbol: string): boolean => {
		const size = board.length;

		// Check rows
		for (let row = 0; row < size; row++) {
			for (let col = 0; col <= size - 5; col++) {
				if (
					board[row]
						.slice(col, col + 5)
						.every((cell) => cell === symbol)
				) {
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
				if (
					[0, 1, 2, 3, 4].every(
						(i) => board[row + i][col + i] === symbol
					)
				) {
					return true;
				}
			}
		}

		// Check diagonals (top-right to bottom-left)
		for (let row = 0; row <= size - 5; row++) {
			for (let col = 4; col < size; col++) {
				if (
					[0, 1, 2, 3, 4].every(
						(i) => board[row + i][col - i] === symbol
					)
				) {
					return true;
				}
			}
		}

		return false;
	};

	const isBoardFull = (board: string[][]): boolean => {
		return board.every((row) => row.every((cell) => cell !== ""));
	};

	const [drawProposed, setDrawProposed] = useState<boolean>(false);

	useEffect(() => {
		// Listen for game state updates from server
		socket.on(
			"gameState",
			({ board: updatedBoard, currentPlayer: updatedPlayer }) => {
				// Only update if the board has changed
				if (JSON.stringify(updatedBoard) !== JSON.stringify(board)) {
					setBoard(updatedBoard);

					// Find what changed to add to moves history
					for (
						let rowIndex = 0;
						rowIndex < updatedBoard.length;
						rowIndex++
					) {
						for (
							let cellIndex = 0;
							cellIndex < updatedBoard[rowIndex].length;
							cellIndex++
						) {
							if (
								updatedBoard[rowIndex][cellIndex] !== "" &&
								board[rowIndex][cellIndex] === ""
							) {
								// This is the new move
								setMoves((prevMoves) => [
									...prevMoves,
									{
										player: updatedBoard[rowIndex][
											cellIndex
										],
										position: [rowIndex, cellIndex],
									},
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
			}
		);

		// Listen for player left event
		socket.on(
			"playerLeft",
			({ board: updatedBoard, currentPlayer: updatedPlayer }) => {
				alert("Your opponent has left the game.");
				setBoard(updatedBoard);
				setCurrentPlayer(updatedPlayer);
			}
		);
		// Listen for resignation
		socket.on("playerResigned", ({ winner }) => {
			setWinner(winner);
			setIsModalOpen(true);
			console.log("winner");
		});

		return () => {
			socket.off("gameState");
			socket.off("playerLeft");
		};
	}, [board, playerSymbol]);

	const handleCellClick = (rowIndex: number, cellIndex: number) => {
		// Check if it's your turn and the cell is empty
		if (!isYourTurn || board[rowIndex][cellIndex] !== "" || winner) {
			return;
		}

		// Get the room ID from URL params
		const urlParams = new URLSearchParams(window.location.search);
		const gameId = urlParams.get("room");

		if (!gameId) {
			console.error("No game ID found");
			return;
		}

		// Send move to server - the server will update the game state
		socket.emit("makeMove", {
			gameId,
			row: rowIndex,
			col: cellIndex,
		});

		// We don't update the local state here anymore
		// The server will emit a gameState event which will update the UI
		// This prevents the UI from getting out of sync with the server
	};

	const saveGame = (name: string, difficulty: string) => {
		if (winner) {
			alert("Cannot save because there is already a winner.");
			return;
		}

		addGame({
			board: board,
			difficulty: difficulty,
			name: name,
		}).then((savedGame) => {
			router.push(`/game/${savedGame.uuid}`);
		});
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

	// Helper function to get game ID
	const getGameId = () => {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get("room");
	};

	// Handle draw proposal
	const handleDrawProposal = () => {
		const gameId = getGameId();
		if (!gameId) return;

		socket.emit("proposeDraw", { gameId });
		setDrawProposed(true);
	};

	// Handle resignation
	const handleResign = () => {
		const gameId = getGameId();
		if (!gameId) return;

		if (confirm("Are you sure you want to resign?")) {
			socket.emit("resign", { gameId });
			setWinner(playerSymbol === "X" ? "O" : "X");
			setIsModalOpen(true);
		}
	};

	return (
		<div className="flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 lg:p-6 lg:gap-4">
			{/* Board */}
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
								<img
									src="/TDA/X_modre.svg"
									alt="X"
									className="w-3/4 h-3/4"
								/>
							)}
							{cell === "O" && (
								<img
									src="/TDA/O_cervene.svg"
									alt="O"
									className="w-3/4 h-3/4"
								/>
							)}
						</div>
					))
				)}
			</div>

			{/* Right Pane */}
			<div className="w-full lg:w-[260px] flex flex-col mt-2 lg:mt-0 lg:self-stretch">
				<Card className="flex flex-col flex-1">
					<CardHeader className="pb-2">
						<div className="flex flex-col space-y-4">
							<div className="text-xl font-bold text-center">
								{winner ? (
									<span className="text-green-600">
										Winner: {winner}
									</span>
								) : (
									<>
										{playerSymbol && (
											<div className="flex items-center justify-center space-x-2 mb-2">
												<span className="text-sm">
													You are playing as:
												</span>
												<div className="w-6 h-6 flex justify-center items-center">
													{playerSymbol === "X" ? (
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
										)}
										<div className="flex items-center justify-center space-x-2">
											<span className="text-sm">
												Current Player:
											</span>
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
												<span className="text-green-600">
													Your turn
												</span>
											) : (
												<span className="text-amber-600">
													Opponent&apos;s turn
												</span>
											)}
										</div>
									</>
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
								<div
									key={index}
									className="flex items-center mb-2"
								>
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
											({move.position[0] + 1},{" "}
											{move.position[1] + 1})
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
						<div className="text-lg font-bold w-full mb-1">
							Game Actions
						</div>
						<Button
							variant="outline"
							onClick={handleDrawProposal}
							disabled={drawProposed || winner !== null}
							className="flex items-center justify-center w-full"
						>
							<Handshake className="h-4 w-4 mr-2" />
							{drawProposed ? "Draw Proposed..." : "Propose Draw"}
						</Button>
						<Button
							variant="destructive"
							onClick={handleResign}
							disabled={winner !== null}
							className="flex items-center justify-center w-full"
						>
							<Flag className="h-4 w-4 mr-2" />
							Give Up
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
