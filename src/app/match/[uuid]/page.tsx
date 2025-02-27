"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import Loading from "@/app/loading";

interface Match {
	uuid: string;
	player1Id: string;
	player2Id: string;
	result: string;
	player1EloChange: number;
	player2EloChange: number;
	finalBoard: string;
	createdAt: string;
	updatedAt: string;
	moves: Move[];
}

interface Move {
	uuid: string;
	matchId: string;
	playerId: string;
	position: [number, number]; // Change position to a tuple of [row, col]
	symbol: string;
	createdAt: string;
}

export default function MatchPage({ params }: { params: Promise<{ uuid: string }> }) {
	const [match, setMatch] = useState<Match | null>(null);
	const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
	const [board, setBoard] = useState<string[]>(Array(225).fill(""));
	const [isPlaying, setIsPlaying] = useState(false);
	const [playbackSpeed, setPlaybackSpeed] = useState(1000);
	const [uuid, setUuid] = useState<string | null>(null);

	useEffect(() => {
		params.then((resolvedParams) => {
			setUuid(resolvedParams.uuid);
		});
	}, [params]);

	const fetchMatch = useCallback(async () => {
		if (!uuid) return;
		try {
			const response = await fetch(`/api/v1/matches/${uuid}`);
			if (!response.ok) throw new Error("Failed to fetch match data");
			const data = await response.json();
			setMatch(data);
			setBoard(Array(225).fill(""));
			setCurrentMoveIndex(-1);
		} catch (error) {
			console.error("Error fetching match:", error);
		}
	}, [uuid]);

	useEffect(() => {
		fetchMatch();
	}, [fetchMatch]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		if (
			isPlaying &&
			match?.moves &&
			currentMoveIndex < match.moves.length - 1
		) {
			timeoutId = setTimeout(() => {
				handleNextMove();
			}, playbackSpeed);
		} else if (currentMoveIndex >= (match?.moves?.length ?? 0) - 1) {
			setIsPlaying(false);
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [isPlaying, currentMoveIndex, match?.moves, playbackSpeed]);

	const handleNextMove = useCallback(() => {
		if (!match?.moves || currentMoveIndex >= match.moves.length - 1) return;
	
		const nextMove = match.moves[currentMoveIndex + 1];
		setBoard((prev) => {
			const newBoard = [...prev];
			const [row, col] = nextMove.position; // Destructure position into row and col
			newBoard[row * 15 + col] = nextMove.symbol; // Calculate index using row and col
			return newBoard;
		});
		setCurrentMoveIndex((prev) => prev + 1);
	}, [match, currentMoveIndex]);
	
	const handlePrevMove = useCallback(() => {
		if (currentMoveIndex < 0) return;
	
		const newBoard = [...board];
		const [row, col] = match!.moves[currentMoveIndex].position; // Destructure position
		newBoard[row * 15 + col] = ""; // Calculate index using row and col
		setBoard(newBoard);
		setCurrentMoveIndex((prev) => prev - 1);
	}, [board, currentMoveIndex, match]);

	const handleReset = useCallback(() => {
		setBoard(Array(225).fill(""));
		setCurrentMoveIndex(-1);
		setIsPlaying(false);
	}, []);

	if (!match) return <Loading />;

	return (
		<div className="flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 lg:p-8 lg:gap-6 min-h-screen">
			{/* Board */}
			<div className="flex flex-wrap rounded-lg border border-gray-400 w-full max-w-[80vh] aspect-square">
				{Array.from({ length: 15 }, (_, row) =>
					Array.from({ length: 15 }, (_, col) => {
						const index = row * 15 + col;
						return (
							<div
								key={`${row}-${col}`}
								className={`border border-gray-300 dark:border-gray-600 flex items-center justify-center ${
									row === 0 && col === 0
										? "rounded-tl-md"
										: row === 0 && col === 14
										? "rounded-tr-md"
										: row === 14 && col === 0
										? "rounded-bl-md"
										: row === 14 && col === 14
										? "rounded-br-md"
										: ""
								}`}
								style={{
									flexBasis: `${100 / 15}%`,
									height: `calc(100% / 15)`,
								}}
							>
								{board[index] === "X" && (
									<img
										src="/TDA/X_modre.svg"
										alt="X"
										className="w-3/4 h-3/4"
									/>
								)}
								{board[index] === "O" && (
									<img
										src="/TDA/O_cervene.svg"
										alt="O"
										className="w-3/4 h-3/4"
									/>
								)}
							</div>
						);
					})
				)}
			</div>

			{/* Right Pane */}
			<div className="w-full lg:w-1/4 xl:w-1/5 flex flex-col lg:h-[80vh] lg:max-h-[80vh] lg:gap-2 mt-4 lg:mt-0">
				<Card className="mb-2">
					<CardHeader>
						<div className="text-xl sm:text-2xl font-bold text-center">
							<div className="flex items-center justify-center space-x-2">
								<span className="text-sm sm:text-md">
									Current Move:
								</span>
								<div className="w-6 h-6 flex justify-center items-center">
									{currentMoveIndex >= 0 &&
										match.moves[currentMoveIndex] && (
											<img
												src={`/TDA/${
													match.moves[
														currentMoveIndex
													].symbol === "X"
														? "X_modre.svg"
														: "O_cervene.svg"
												}`}
												alt={
													match.moves[
														currentMoveIndex
													].symbol
												}
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
						<div className="text-lg font-bold">Moves History:</div>
					</CardHeader>
					<CardContent className="flex-grow p-0">
						<ScrollArea className="flex-grow w-full p-4 h-[calc(100%-120px)]">
							{match.moves.map((move, index) => (
								<div
									key={index}
									className={`flex items-center mb-2 p-2 rounded ${
										index === currentMoveIndex
											? "bg-secondary"
											: "hover:bg-secondary/50"
									}`}
								>
									<div className="flex items-center space-x-2">
										<div className="w-6 h-6 flex items-center justify-center">
											<img
												src={`/TDA/${
													move.symbol === "X"
														? "X_modre.svg"
														: "O_cervene.svg"
												}`}
												alt={move.symbol}
												className="w-full h-full"
											/>
										</div>
										<span className="text-sm">
											Position: {move.position[0] + 1}, {move.position[1] + 1}
										</span>
									</div>
								</div>
							))}
						</ScrollArea>
					</CardContent>
					<CardFooter className="flex flex-col space-y-2">
						<div className="flex justify-between w-full gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={handlePrevMove}
								disabled={currentMoveIndex < 0}
							>
								<SkipBack className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setIsPlaying(!isPlaying)}
							>
								{isPlaying ? (
									<Pause className="h-4 w-4" />
								) : (
									<Play className="h-4 w-4" />
								)}
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={handleNextMove}
								disabled={
									currentMoveIndex >=
									(match.moves?.length ?? 0) - 1
								}
							>
								<SkipForward className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={handleReset}
							>
								<RotateCcw className="h-4 w-4" />
							</Button>
						</div>
						<div className="flex flex-col w-full gap-2">
							<span className="text-sm">
								Playback Speed: {playbackSpeed}ms
							</span>
							<input
								type="range"
								min="200"
								max="2000"
								step="100"
								value={playbackSpeed}
								onChange={(e) =>
									setPlaybackSpeed(Number(e.target.value))
								}
								className="w-full"
							/>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}