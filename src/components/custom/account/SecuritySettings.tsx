"use client";
import { SecurityForm } from "./settings/SecurityForm";
import { UsernameSettings } from "./settings/UsernameSettings";

export function SecuritySettings() {
	return (
		<div className="space-y-6">
			<UsernameSettings />
			<SecurityForm />
		</div>
	);
}
