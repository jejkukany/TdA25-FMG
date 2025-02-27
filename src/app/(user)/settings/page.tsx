"use client";
import React, { useState } from "react";
import { client } from "@/server/auth/client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SecuritySettings } from "@/components/custom/account/SecuritySettings";
import Link from "next/link";

function Settings() {
	const [name, setName] = useState("");
	const { data: data, isPending } = client.useSession();
	const user = data?.user;

	const changeUsername = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("Username cannot be empty");
			return;
		}

		try {
			const updateUser = await client.updateUser({
				name: name,
				username: name,
			});
			if (updateUser.error) {
				toast.error(updateUser.error.message);
				return;
			}
			setName("");
			toast.success("Username updated successfully");
		} catch (error) {
			console.error("Failed to update username:", error);
			toast.error("Failed to update username");
		}
	};

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
						settings
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl py-10 px-6">
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">
						Manage your account settings and preferences.
					</p>
				</div>
				<Separator />
				<SecuritySettings />
			</div>
		</div>
	);
}

export default Settings;
