"use client";

import { client } from "@/server/auth/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Target, MinusCircle, Minus } from "lucide-react";
import Link from "next/link";

export default function Profile() {
	const { data: data, isPending } = client.useSession();
	const user = data?.user;

	if (isPending) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="p-6 text-center text-muted-foreground">
						Please
						<Link href={"/sign-in"}> sign in</Link> to view your
						profile
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
						Profile
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* User Info */}
					<div className="flex items-start gap-6 flex-col sm:flex-row">
						<Avatar className="h-32 w-32 rounded-lg">
							<AvatarImage
								src={user.image ?? ""}
								alt={user.name}
							/>
							<AvatarFallback className="text-3xl">
								{user.name?.[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<h2 className="text-3xl font-bold">{user.name}</h2>
							<p className="text-lg text-muted-foreground">
								{user.email}
							</p>
						</div>
					</div>

					{/* Stats Cards */}
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
						<Card>
							<CardContent className="p-8 flex items-center gap-4">
								<div className="p-4 bg-primary/10 rounded-lg">
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
		</div>
	);
}
