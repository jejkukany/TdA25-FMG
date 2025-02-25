"use client";

import { client } from "@/server/auth/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Gavel, Link } from "lucide-react";
import { Search } from "lucide-react";
import { UserCheck } from "lucide-react";

interface User {
	id: string;
	uuid: string;
	username: string;
	email: string;
	elo: number;
	wins: number;
	draws: number;
	losses: number;
	banned: boolean;
}

export default function AdminDashboard() {
	const router = useRouter();
	const { data: session, isPending } = client.useSession();
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	useEffect(() => {
		if (isPending) return; // Wait for session to load

		if (session?.user?.role !== "admin") {
			router.push("/");
			return;
		}

		fetchUsers();
	}, [session, router, isPending]); // Add status to dependencies

	useEffect(() => {
		const filtered = users.filter((user) =>
			[user.username, user.email, user.uuid]
				.join(" ")
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
		setFilteredUsers(filtered);
	}, [searchQuery, users]);

	const fetchUsers = async () => {
		try {
			const response = await fetch("/api/v1/users");
			const data = await response.json();
			setUsers(data);
		} catch (error) {
			console.error("Failed to fetch users:", error);
		}
	};
	const banUser = async (id: string, banned: boolean) => {
		if (!banned) {
			await client.admin.banUser({
				userId: id,
			});
		} else {
			await client.admin.unbanUser({
				userId: id,
			});
		}
		fetchUsers();
	};
	const updateUser = async (uuid: string, data: Partial<User>) => {
		try {
			const response = await fetch(`/api/v1/users/${uuid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...data,
					is_banned: data.banned, // Convert to snake_case for API
				}),
			});
			if (response.ok) {
				fetchUsers();
			}
		} catch (error) {
			console.error("Failed to update user:", error);
		}
	};

	if (isPending) {
		return <div className="container mx-auto py-10">Loading...</div>;
	}

	if (session?.user?.role !== "admin") {
		return null;
	}

	return (
		<div className="container mx-auto py-10">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-2xl font-bold flex items-center gap-2">
						<Shield className="h-6 w-6" />
						Admin Dashboard
					</CardTitle>
					<div className="relative w-72">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by name, email, or UUID..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8"
						/>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Username</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>ELO</TableHead>
								<TableHead>Wins</TableHead>
								<TableHead>Draws</TableHead>
								<TableHead>Losses</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user) => (
								<TableRow key={user.uuid}>
									<TableCell>{user.username}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell className="flex items-center gap-2">
										<Input
											type="number"
											value={user.elo}
											className="w-20"
											onChange={(e) => {
												const newElo = parseInt(
													e.target.value
												);
												if (!isNaN(newElo)) {
													updateUser(user.uuid, {
														elo: newElo,
													});
												}
											}}
										/>
									</TableCell>
									<TableCell>{user.wins}</TableCell>
									<TableCell>{user.draws}</TableCell>
									<TableCell>{user.losses}</TableCell>
									<TableCell className="flex items-center gap-2">
										<Button
											variant={
												user.banned
													? "outline"
													: "destructive"
											}
											onClick={() => {
												banUser(user.id, user.banned);
											}}
											className=""
										>
											{user.banned ? (
												<>
													<UserCheck className="h-4 w-4 mr-2" />
													Unban
												</>
											) : (
												<>
													<Gavel className="h-4 w-4 mr-2" />
													Ban
												</>
											)}
										</Button>
										<Button
											variant="outline"
											onClick={() =>
												router.push(
													`/profile/${user.uuid}`
												)
											}
										>
											<Link className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
