"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/server/auth/client";
import { Gavel, UserCheck } from "lucide-react";
import { useState } from "react";

interface BanDialogProps {
	userId: string;
	isBanned: boolean;
	banReason?: string;
	banExpires?: string; // Changed from number to string
	onBanComplete?: () => void;
}

const banDurations = [
	{ label: "1 Hour", value: 60 * 60 },
	{ label: "1 Day", value: 60 * 60 * 24 },
	{ label: "1 Week", value: 60 * 60 * 24 * 7 },
	{ label: "1 Month", value: 60 * 60 * 24 * 30 },
	{ label: "Permanent", value: 0 },
];

export function BanDialog({
	userId,
	isBanned,
	banReason,
	banExpires,
	onBanComplete,
}: BanDialogProps) {
	const [open, setOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [duration, setDuration] = useState<number>(banDurations[0].value);
	const [isLoading, setIsLoading] = useState(false);
	console.log(banExpires);
	const handleBan = async () => {
		try {
			setIsLoading(true);
			await client.admin.banUser({
				userId,
				banReason: reason || undefined,
				banExpiresIn: duration || undefined,
			});
			setOpen(false);
			onBanComplete?.();
		} catch (error) {
			console.error("Failed to ban user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUnban = async () => {
		try {
			setIsLoading(true);
			await client.admin.unbanUser({
				userId,
			});
			setOpen(false);
			onBanComplete?.();
		} catch (error) {
			console.error("Failed to unban user:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const getRemainingTime = () => {
		if (!banExpires) return "Permanently";
		const now = new Date();
		const expiresAt = new Date(banExpires);

		if (expiresAt <= now) return "Expired";

		const diff = expiresAt.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

		if (days > 0) return `${days} days`;
		if (hours > 0) return `${hours} hours`;
		if (minutes > 0) return `${minutes} minutes`;
		return "less than a minute";
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={isBanned ? "outline" : "destructive"}>
					{isBanned ? (
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
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isBanned ? "Unban User" : "Ban User"}
					</DialogTitle>
					<DialogDescription>
						{isBanned
							? `Currently banned ${
									banReason ? `for "${banReason}"` : ""
							  } (${getRemainingTime()} remaining)`
							: "Set the duration and reason for banning this user."}
					</DialogDescription>
				</DialogHeader>
				{!isBanned && (
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="duration">Ban Duration</Label>
							<Select
								value={duration.toString()}
								onValueChange={(value) =>
									setDuration(Number(value))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select duration" />
								</SelectTrigger>
								<SelectContent>
									{banDurations.map((option) => (
										<SelectItem
											key={option.value}
											value={option.value.toString()}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="reason">Reason</Label>
							<Textarea
								id="reason"
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="Enter ban reason..."
							/>
						</div>
					</div>
				)}
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						variant={isBanned ? "outline" : "destructive"}
						onClick={isBanned ? handleUnban : handleBan}
						disabled={isLoading}
					>
						{isLoading
							? isBanned
								? "Unbanning..."
								: "Banning..."
							: isBanned
							? "Confirm Unban"
							: "Ban User"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
