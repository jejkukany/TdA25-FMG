"use client";
import React from "react";
import { client } from "@/server/auth/client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SecuritySettings } from "@/components/custom/account/SecuritySettings";
import Link from "next/link";

function Settings() {
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
					<h2 className="text-2xl font-bold tracking-tight">
						Settings
					</h2>
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
