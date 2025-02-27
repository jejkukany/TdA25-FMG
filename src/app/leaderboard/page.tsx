"use client";

import { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { client } from "@/server/auth/client";

interface User {
	uuid: string;
	username: string;
	email: string;
	elo: number;
	wins: number;
	draws: number;
	losses: number;
}

export default function Leaderboard() {
	const [users, setUsers] = useState<User[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const { data: session } = client.useSession();

	const getRankIcon = (index: number) => {
		switch (index) {
			case 0:
				return <Trophy className="h-5 w-5 text-yellow-500 ml-auto" />;
			case 1:
				return <Medal className="h-5 w-5 text-gray-400 ml-auto " />;
			case 2:
				return <Medal className="h-5 w-5 text-amber-600 ml-auto" />;
			default:
				return <span className="font-medium">{index + 1}</span>;
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("/api/v1/users");
				const data = await response.json();
				setUsers(data);
			} catch (error) {
				console.error("Failed to fetch users:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	const filteredUsers = users
		.filter(
			(user) =>
				(user.username?.toLowerCase() || "").includes(
					searchTerm.toLowerCase()
				) ||
				(user.uuid?.toLowerCase() || "").includes(
					searchTerm.toLowerCase()
				)
		)
		.sort((a, b) => b.elo - a.elo);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
			<Card>
				<CardHeader className="flex-row flex items-center justify-between">
					<CardTitle className="text-2xl font-bold">
						Leaderboard
					</CardTitle>
					<div className="flex items-center space-x-2">
						<Search className="h-5 w-5 text-muted-foreground" />
						<Input
							placeholder="Search players..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-[250px]"
						/>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
                                  <TableHead className="w-16 text-right pr-8">Rank</TableHead>
                                  <TableHead className="w-[50%] pl-4">Player</TableHead>
                                  <TableHead className="text-right w-[150px] pr-8">ELO</TableHead>
                                  <TableHead className="text-right w-[150px] pr-8">Win Rate</TableHead>
                                  <TableHead className="text-right w-[100px] pr-8">Games</TableHead>
                                </TableRow>
							</TableHeader>
							<TableBody>
								{filteredUsers.map((user, index) => {
									const totalGames =
										user.wins + user.draws + user.losses;
									const winRate =
										totalGames > 0
											? (
													(user.wins / totalGames) *
													100
											  ).toFixed(1)
											: "0.0";
									const isCurrentUser =
										session?.user?.uuid === user.uuid;

									return (
										<TableRow
											key={user.uuid}
											className={
												isCurrentUser
													? "bg-muted/50"
													: ""
											}
										>
											<TableCell className="text-right pr-8">
												<div className="flex justify-end items-center">
													{getRankIcon(index)}
												</div>
											</TableCell>
											<TableCell className="pl-4">
												<div className="flex items-center gap-3">
													<Avatar className="h-8 w-8">
														<AvatarImage
															src=""
															alt={user.username}
														/>
														<AvatarFallback>
															{user.username[0]?.toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div className="flex items-center gap-2">
														<a
															href={`/profile/${user.uuid}`}
															className="font-medium hover:underline"
														>
															{user.username}
														</a>
														{isCurrentUser && (
															<Badge
																variant="secondary"
																className="ml-2"
															>
																You
															</Badge>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell className="text-right pr-8 font-medium">
												{user.elo}
											</TableCell>
											<TableCell className="text-right pr-8">
												{winRate}%
											</TableCell>
											<TableCell className="text-right pr-8 text-muted-foreground">
												{totalGames}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
