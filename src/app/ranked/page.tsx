"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankedBoard } from "@/components/custom/game/RankedBoard/RankedBoard";
import { WaitingRoom } from "@/components/custom/game/RankedBoard/WaitingRoom";

export default function RankedPage() {
	const [gameState, setGameState] = useState<
		"waiting" | "playing" | "finished"
	>("waiting");
	const [player1, setPlayer1] = useState<string>("Player 1");
	const [player2, setPlayer2] = useState<string>("Player 2");
	const [player1Elo, setPlayer1Elo] = useState<number>(1200);
	const [player2Elo, setPlayer2Elo] = useState<number>(1200);
	const [matchResult, setMatchResult] = useState<
		"player1" | "player2" | "draw" | null
	>(null);

	const handleStartGame = (p1: string, p2: string, p1Elo?: number, p2Elo?: number) => {
		setPlayer1(p1);
		setPlayer2(p2);
		if (p1Elo) setPlayer1Elo(p1Elo);
		if (p2Elo) setPlayer2Elo(p2Elo);
		setGameState("playing");
	};

	const handleGameEnd = (result: "player1" | "player2" | "draw") => {
		setMatchResult(result);
		setGameState("finished");
	};

	const handleRematch = () => {
		// Switch players for rematch
		setPlayer1(player2);
		setPlayer2(player1);
		setMatchResult(null);
		setGameState("playing");
	};

  // Add persistence
  useEffect(() => {
    // Try to restore game state from localStorage
    const savedState = localStorage.getItem('rankedGameState');
    if (savedState) {
      const { state, p1, p2, p1Elo, p2Elo, result } = JSON.parse(savedState);
      setGameState(state);
      setPlayer1(p1);
      setPlayer2(p2);
      setPlayer1Elo(p1Elo);
      setPlayer2Elo(p2Elo);
      setMatchResult(result);
    }
  }, []);

  // Save state changes
  useEffect(() => {
    localStorage.setItem('rankedGameState', JSON.stringify({
      state: gameState,
      p1: player1,
      p2: player2,
      p1Elo: player1Elo,
      p2Elo: player2Elo,
      result: matchResult
    }));
  }, [gameState, player1, player2, player1Elo, player2Elo, matchResult]);

  const handleFindNewMatch = () => {
    setMatchResult(null);
    setGameState("waiting");
    // Clear saved state when starting new match
    localStorage.removeItem('rankedGameState');
  };

	return (
		<div className="2xl:px-4 w-full flex flex-col lg:justify-center xl:mt-[-28px] lg:min-h-screen">
			{gameState === "waiting" && (
				<WaitingRoom onStartGame={handleStartGame} />
			)}

			{gameState === "playing" && (
				<RankedBoard
					player1={player1}
					player2={player2}
					player1Elo={player1Elo}
					player2Elo={player2Elo}
					onGameEnd={handleGameEnd}
				/>
			)}

			{gameState === "finished" && (
				<div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
					<Card className="max-w-md mx-auto">
						<CardHeader>
							<CardTitle className="text-center">
								{matchResult === "draw"
									? "Game Ended in a Draw"
									: `${
											matchResult === "player1"
												? player1
												: player2
									} Won!`}
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<Button onClick={handleRematch} variant="default">
								Rematch (Switch Sides)
							</Button>
							<Button onClick={handleFindNewMatch} variant="outline">
								Find New Match
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
