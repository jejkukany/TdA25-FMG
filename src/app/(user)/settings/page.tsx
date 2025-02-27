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

function Settings() {
	const [name, setName] = useState("");

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

	return (
		<div className="mx-auto max-w-4xl py-10 px-6">
			<div className="space-y-6">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Settings
					</h2>
					<p className="text-muted-foreground">
						Manage your account settings and preferences.
					</p>
				</div>
				<Separator />
				<div className="grid gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Profile Settings</CardTitle>
							<CardDescription>
								Update your profile information.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={changeUsername}
								className="space-y-4"
							>
								<div className="space-y-2">
									<Label htmlFor="name">Username</Label>
									<Input
										id="name"
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
										placeholder="Enter new name"
									/>
								</div>
								<Button type="submit">Update Name</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default Settings;
