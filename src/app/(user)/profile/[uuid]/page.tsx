"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Target, MinusCircle, Minus } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MatchHistory } from "@/components/custom/profile/MatchHistory";
import Loading from "@/app/loading";

interface UserProfile {
	uuid: string;
	username: string;
	email: string;
	elo: number;
	wins: number;
	draws: number;
	losses: number;
	createdAt: string;
}

export default function UserProfile() {
	const params = useParams<{ uuid: string }>();
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch(`/api/v1/users/${params.uuid}`);
				if (!response.ok) {
					throw new Error("User not found");
				}
				const data = await response.json();
				setUser(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load user"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [params.uuid]);

	if (isLoading) {
		return (
			<Loading />
		);
	}

	if (error || !user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center text-muted-foreground">
						{error || "User not found"}
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
			<Card className="w-full">
				<CardHeader className="pb-4">
					<CardTitle className="text-2xl font-bold">
						Player Profile
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* User Info */}
					<div className="flex items-start gap-6 flex-col sm:flex-row">
						<Avatar className="h-32 w-32 rounded-lg">
							<AvatarFallback className="text-3xl">
								{user.username[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<h2 className="text-3xl font-bold">
								{user.username}
							</h2>
							<p className="text-sm text-muted-foreground">
								Member since{" "}
								{new Date(user.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
						<Card>
							<CardContent className="p-8 flex items-center gap-4">
								<div className="p-4 rounded-lg">
									<Target className="h-8 w-8 text-primary" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										ELO Rating
									</p>
									<h3 className="text-3xl font-bold">
										{user.elo}
									</h3>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-8 flex items-center gap-4">
								<div className="p-4 bg-green-500/10 rounded-lg">
									<Trophy className="h-8 w-8 text-green-500" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Wins
									</p>
									<h3 className="text-3xl font-bold">
										{user.wins}
									</h3>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-8 flex items-center gap-4">
								<div className="p-4 bg-yellow-500/10 rounded-lg">
									<Minus className="h-8 w-8 text-yellow-500" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Draws
									</p>
									<h3 className="text-3xl font-bold">
										{user.draws}
									</h3>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="p-8 flex items-center gap-4">
								<div className="p-4 bg-red-500/10 rounded-lg">
									<MinusCircle className="h-8 w-8 text-red-500" />
								</div>
								<div>
									<p className="text-sm text-muted-foreground">
										Losses
									</p>
									<h3 className="text-3xl font-bold">
										{user.losses}
									</h3>
								</div>
							</CardContent>
						</Card>
					</div>
				</CardContent>
			</Card>

			{/* Add Match History */}
			<MatchHistory userUuid={user.uuid} />
		</div>
	);
}