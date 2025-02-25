"use client";

import { useState, useEffect } from "react";
import { client } from "@/server/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();

	useEffect(() => {
		// Store the current URL (excluding the sign-in page) in localStorage
		const currentPath = window.location.pathname;
		if (currentPath !== "/sign-up") {
			localStorage.setItem("previousUrl", currentPath);
		}
	}, []);
	const signUp = async () => {
		setLoading(true);
		setError(null);

		if (!name || !email || !password) {
			setError("Please fill in all fields");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/v1/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: name,
					email,
					password,
					elo: 400,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to sign up");
			}

			// After successful signup, sign in the user
			await client.signIn.email({
				email,
				password,
			});

			router.push("/");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sign up");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen min-w-96 items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>Create an account</CardTitle>
					<CardDescription>
						Sign up to get started with our service
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						className="space-y-4"
						onSubmit={async (e) => {
							e.preventDefault();
							await signUp();
						}}
					>
						<div>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								value={name}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setName(e.target.value)
								}
								placeholder="John Doe"
								required
							/>
						</div>
						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setEmail(e.target.value)
								}
								placeholder="john@example.com"
								required
							/>
						</div>
						<div>
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setPassword(e.target.value)
								}
								placeholder="••••••••"
								required
							/>
						</div>
						{error && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Signing up...
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}