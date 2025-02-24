"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import {
	LogOut,
	Settings,
	User,
	ChevronsUpDown,
	Moon,
	LogIn,
	UserPlus,
} from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { client } from "@/server/auth/client";

export function UserMenu() {
	const { theme, setTheme } = useTheme();
	const { data: data } = client.useSession();

	const user = data?.user;

	const handleSignOut = async () => {
		await client.signOut();
	};
	console.log(user?.role);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="h-12 w-12 rounded-lg">
						<AvatarImage
							src={user?.image ?? ""}
							alt={user?.name ?? "User"}
						/>
						<AvatarFallback>
							{user?.name?.[0]?.toUpperCase() ?? "G"}
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{user?.name ?? "Guest"}
						</span>
						<span className="truncate text-xs text-muted-foreground">
							{user?.email ?? "Sign in to play"}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="end"
				sideOffset={4}
			>
				<DropdownMenuLabel className="p-0 font-normal">
					<div className="flex items-center gap-2 px-1 py-1.5">
						<Avatar className="h-12 w-12 rounded-lg">
							<AvatarImage
								src={user?.image ?? ""}
								alt={user?.name ?? "User"}
							/>
							<AvatarFallback>
								{user?.name?.[0]?.toUpperCase() ?? "G"}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 gap-1">
							<span className="truncate font-semibold">
								{user?.name ?? "Guest"}
							</span>
							<span className="truncate text-xs text-muted-foreground">
								{user?.email ?? "Sign in to play"}
							</span>
						</div>
					</div>
					{user && (
						<div className="grid grid-cols-4 gap-2 p-2 mt-2 bg-muted/50 rounded-md text-center text-sm">
							<div>
								<div className="font-semibold">{user.elo}</div>
								<div className="text-xs text-muted-foreground">
									ELO
								</div>
							</div>
							<div>
								<div className="font-semibold">{user.wins}</div>
								<div className="text-xs text-muted-foreground">
									Wins
								</div>
							</div>
							<div>
								<div className="font-semibold">
									{user.draws}
								</div>
								<div className="text-xs text-muted-foreground">
									Draws
								</div>
							</div>
							<div>
								<div className="font-semibold">
									{user.losses}
								</div>
								<div className="text-xs text-muted-foreground">
									Losses
								</div>
							</div>
						</div>
					)}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{user ? (
					<>
						<DropdownMenuItem asChild>
							<Link href="/profile">
								<User className="mr-2 h-4 w-4" />
								<span>Profile</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/settings">
								<Settings className="mr-2 h-4 w-4" />
								<span>Settings</span>
							</Link>
						</DropdownMenuItem>
					</>
				) : (
					<>
						<DropdownMenuItem asChild>
							<Link href="/sign-in" className="w-full">
								<LogIn className="mr-2 h-4 w-4" />
								<span>Sign In</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/sign-up" className="w-full">
								<UserPlus className="mr-2 h-4 w-4" />
								<span>Sign Up</span>
							</Link>
						</DropdownMenuItem>
					</>
				)}

				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="flex items-center justify-between cursor-pointer"
					onSelect={(event) => {
						event.preventDefault();
						setTheme(theme === "dark" ? "light" : "dark");
					}}
				>
					<div className="flex items-center">
						<Moon className="mr-2 h-4 w-4" />
						<span>Dark Mode</span>
					</div>
					<Switch checked={theme === "dark"} />
				</DropdownMenuItem>

				{user && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onSelect={handleSignOut}
						>
							<LogOut className="mr-2 h-4 w-4" />
							<span>Sign Out</span>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
