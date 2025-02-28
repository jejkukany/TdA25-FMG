"use client";

import React, { useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlayerInfoCard } from "./PlayerInfoCard";
import { GameBoard } from "./GameBoard";
import { GameControls } from "./GameControls";

// First, let's update the props interface to include ELO ratings
interface RankedBoardProps {
	player1: string;
	player2: string;
	player1Elo?: number; // Adding optional ELO props
	player2Elo?: number;
	onGameEnd: (result: "player1" | "player2" | "draw") => void;
}

export const RankedBoard: React.FC<RankedBoardProps> = ({
	player1,
	player2,
	player1Elo = 1200, // Default ELO if not provided
	player2Elo = 1200,
	onGameEnd,
}) => {
	const initialBoard = Array(15)
		.fill(null)
		.map(() => Array(15).fill(""));
	const [board, setBoard] = useState<string[][]>(initialBoard);
	const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
	const [moves, setMoves] = useState<
		{ player: "X" | "O"; position: [number, number] }[]
	>([]);

	// Timer states (8 minutes = 480 seconds per player)
	const [player1Time, setPlayer1Time] = useState<number>(480);
	const [player2Time, setPlayer2Time] = useState<number>(480);

	// Dialog states
	const [isDrawDialogOpen, setIsDrawDialogOpen] = useState<boolean>(false);
	const [isResignDialogOpen, setIsResignDialogOpen] =
		useState<boolean>(false);
	const [drawProposed, setDrawProposed] = useState<boolean>(false);
	const [drawProposedBy, setDrawProposedBy] = useState<"X" | "O" | null>(
		null
	);

	// Update timers
	useEffect(() => {
		const timer = setInterval(() => {
			if (currentPlayer === "X") {
				setPlayer1Time((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						onGameEnd("player2"); // Player 1 (X) ran out of time
						return 0;
					}
					return prev - 1;
				});
			} else {
				setPlayer2Time((prev) => {
					if (prev <= 1) {
						clearInterval(timer);
						onGameEnd("player1"); // Player 2 (O) ran out of time
						return 0;
					}
					return prev - 1;
				});
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [currentPlayer, onGameEnd]);

	const handleCellClick = (rowIndex: number, cellIndex: number) => {
		if (board[rowIndex][cellIndex] !== "") {
			return;
		}

		const newBoard = board.map((row, rIndex) =>
			row.map((cell, cIndex) =>
				rIndex === rowIndex && cIndex === cellIndex
					? currentPlayer
					: cell
			)
		);

		setBoard(newBoard);
		setMoves((prevMoves) => [
			...prevMoves,
			{ player: currentPlayer, position: [rowIndex, cellIndex] },
		]);

		// For now, we're not implementing win detection as requested
		setCurrentPlayer(currentPlayer === "X" ? "O" : "X");

		// Clear draw proposal when a move is made
		if (drawProposed) {
			setDrawProposed(false);
			setDrawProposedBy(null);
		}
	};

	const handleProposeDrawClick = () => {
		if (drawProposed) {
			// If draw was proposed by the other player, accept it
			if (drawProposedBy !== currentPlayer) {
				onGameEnd("draw");
			}
		} else {
			// Show dialog for new draw proposal
			setIsDrawDialogOpen(true);
		}
	};

	const handleDrawConfirm = () => {
		setDrawProposed(true);
		setDrawProposedBy(currentPlayer);
		setIsDrawDialogOpen(false);
	};

	const handleResignClick = () => {
		setIsResignDialogOpen(true);
	};

	const confirmResign = () => {
		onGameEnd(currentPlayer === "X" ? "player2" : "player1");
		setIsResignDialogOpen(false);
	};

	return (
		<div className="flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 lg:p-6 lg:gap-4">
			{/* Left side with board and player info */}
			<div className="flex flex-col items-center gap-2 w-full max-w-[70vh]">
				{/* Player 2 info */}
				<PlayerInfoCard
					playerName={player2}
					playerElo={player2Elo}
					playerSymbol="O"
					timeRemaining={player2Time}
					isHigherRated={player2Elo > player1Elo}
				/>

				{/* Game board */}
				<GameBoard board={board} onCellClick={handleCellClick} />

				{/* Player 1 info */}
				<PlayerInfoCard
					playerName={player1}
					playerElo={player1Elo}
					playerSymbol="X"
					timeRemaining={player1Time}
					isHigherRated={player1Elo > player2Elo}
				/>
			</div>

			{/* Right section: Game controls */}
			<div className="w-full lg:w-[260px] flex flex-col mt-2 lg:mt-0 lg:self-stretch">
				<GameControls
					currentPlayer={currentPlayer}
					moves={moves}
					drawProposed={drawProposed}
					drawProposedBy={drawProposedBy}
					onProposeDrawClick={handleProposeDrawClick}
					onResignClick={handleResignClick}
				/>
			</div>

			{/* Dialogs remain the same */}
			<AlertDialog
				open={isResignDialogOpen}
				onOpenChange={setIsResignDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to resign?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. Your opponent will win
							the match.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmResign}
							className="bg-destructive text-destructive-foreground"
						>
							Resign
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog
				open={isDrawDialogOpen}
				onOpenChange={setIsDrawDialogOpen}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Propose a Draw?</AlertDialogTitle>
						<AlertDialogDescription>
							Your opponent will need to accept the draw proposal
							for the game to end in a draw.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDrawConfirm}>
							Propose Draw
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
