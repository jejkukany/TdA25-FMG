"use client";

import React from "react";
import { Card, CardHeader } from "@/components/ui/card";

interface PlayerInfoCardProps {
	playerName: string;
	playerElo: number;
	playerSymbol: "X" | "O";
	timeRemaining: number;
	isHigherRated: boolean;
}

export const PlayerInfoCard: React.FC<PlayerInfoCardProps> = ({
	playerName,
	playerElo,
	playerSymbol,
	timeRemaining,
}) => {
	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<Card className="w-full">
			<CardHeader className="py-2">
				<div className="flex justify-between items-center p-2 rounded-md">
					<div className="flex items-center space-x-2">
						<img
							src={
								playerSymbol === "X"
									? "/TDA/X_modre.svg"
									: "/TDA/O_cervene.svg"
							}
							alt={playerSymbol}
							className="w-6 h-6"
						/>
						<div className="flex flex-col">
							<span className="font-medium flex items-center gap-1">
								{playerName}
								<span className="text-xs text-muted-foreground">
									({playerElo})
								</span>
							</span>
						</div>
					</div>
					<div
						className={`font-mono font-bold ${
							timeRemaining < 60 ? "text-red-500" : ""
						}`}
					>
						{formatTime(timeRemaining)}
					</div>
				</div>
			</CardHeader>
		</Card>
	);
};
