"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface Match {
	id: string;
	player1Id: string;
	player2Id: string;
	result: "player1_win" | "player2_win" | "draw";
	player1EloChange: number;
	player2EloChange: number;
	createdAt: string;
}

interface MatchHistoryProps {
	userUuid: string;
}

export function MatchHistory({ userUuid }: MatchHistoryProps) {
	const [matches, setMatches] = useState<Match[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchMatches = async () => {
			try {
				const response = await fetch(
					`/api/v1/matches?userUuid=${userUuid}`
				);
				if (!response.ok) throw new Error("Failed to fetch matches");
				const data = await response.json();
				setMatches(data);
			} catch (error) {
				console.error("Error fetching matches:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMatches();
	}, [userUuid]);

	if (isLoading) return <div>Loading matches...</div>;

	return (
		<Card className="w-full mt-6">
			<CardHeader>
				<CardTitle>Match History</CardTitle>
			</CardHeader>
			<CardContent>
				{matches.length === 0 ? (
					<p className="text-muted-foreground text-center py-4">
						No matches played yet
					</p>
				) : (
					<div className="space-y-4">
						{matches.map((match, index) => (
							<Card key={index} className="p-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="font-medium">
											{new Date(
												match.createdAt
											).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})}
										</p>
										<p className="text-sm text-muted-foreground">
											{match.result === "player1_win"
												? "Victory"
												: match.result === "player2_win"
												? "Defeat"
												: "Draw"}
										</p>
									</div>
									<div className="text-right">
										<p className="font-medium">
											ELO{" "}
											<span
												className={
													match.player1EloChange > 0
														? "text-green-500"
														: "text-red-500"
												}
											>
												{match.player1EloChange > 0
													? `+${match.player1EloChange}`
													: match.player1EloChange}
											</span>
										</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}