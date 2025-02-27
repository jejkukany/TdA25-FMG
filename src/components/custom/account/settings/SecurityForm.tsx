"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EmailForm } from "./EmailForm";
import { PasswordForm } from "./PasswordForm";

export function SecurityForm() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Security Settings</CardTitle>
				<CardDescription>Manage your account security.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<EmailForm />
				<PasswordForm />
			</CardContent>
		</Card>
	);
}
