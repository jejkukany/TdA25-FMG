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
import { Shield, Link } from "lucide-react";
import { Search } from "lucide-react";
import { BanDialog } from "@/components/custom/admin/BanDialog";
import Loading from "../loading";

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
	banReason?: string;
	banExpires?: string; // Changed from number to string for ISO date format
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
		return <Loading />;
	}

	if (session?.user?.role !== "admin") {
		return null;
	}

	return (
		<div className="container mx-auto py-10 px-4">
			<Card>
				<CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
						<Shield className="h-5 w-5 sm:h-6 sm:w-6" />
						Admin Dashboard
					</CardTitle>
					<div className="relative w-full sm:w-72">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8"
						/>
					</div>
				</CardHeader>
				<CardContent className="overflow-x-auto">
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
									<TableCell className="whitespace-nowrap">
										{user.username}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{user.email}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<Input
											type="number"
											value={user.elo}
											className="w-16 sm:w-20"
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
									<TableCell className="whitespace-nowrap">
										{user.wins}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{user.draws}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										{user.losses}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<div className="flex items-center gap-2">
											<BanDialog
												userId={user.id}
												isBanned={user.banned}
												banReason={user.banReason}
												banExpires={user.banExpires} // Changed from banExpires to banExpiresAt to match component prop
												onBanComplete={fetchUsers}
											/>
											<Button
												size="sm"
												variant="outline"
												onClick={() =>
													router.push(
														`/profile/${user.uuid}`
													)
												}
											>
												<Link className="h-4 w-4" />
											</Button>
										</div>
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
