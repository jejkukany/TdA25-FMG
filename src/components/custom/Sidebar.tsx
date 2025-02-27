"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PlayCircle, Home, Trophy, Puzzle } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserMenu } from "./UserMenu";

const menuItems = [
	{ icon: Home, label: "Home", href: "/" },
	{ icon: PlayCircle, label: "Local Play", href: "/game" },
	{ icon: Puzzle, label: "Puzzles", href: "/games" },
	{ icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
];

const SideBar = () => {
	const { state, isMobile } = useSidebar();
	const pathname = usePathname();
	return (
		<Sidebar
			className="border-r bg-[#262421] flex flex-col overflow-hidden"
			collapsible="icon"
		>
			<SidebarHeader>
				<div
					className={cn(
						"h-[48px] w-[160px] flex items-center relative",
						state === "collapsed"
							? "justify-left pl-[1.2px]"
							: "justify-center"
					)}
				>
					<Image
						src="/TDA/Think-different-Academy_LOGO_oficialni_1_dark-mode.svg"
						alt="Think Different Academy"
						className={cn(
							"h-12 hidden",
							state !== "collapsed" && !isMobile && "dark:block", // Show when not collapsed, dark mode
							isMobile && "block" // Show on mobile
						)}
						priority
						fill
					/>
					<Image
						src="/TDA/Think-different-Academy_LOGO_oficialni_1.svg"
						alt="Think Different Academy"
						fill
						priority
						className={cn(
							"h-12 dark:hidden",
							state === "collapsed" && !isMobile && "hidden", // Hide on collapse and non-mobile view
							!isMobile && "block" // Show on non-mobile when not collapsed
						)}
					/>
					<Image
						src="/TDA/Think-different-Academy_LOGO_erb.svg"
						alt="Think Different Academy"
						className={cn(
							state === "collapsed" ? "p-[2.0px]" : "hidden", // Show on dark mode when collapsed
							isMobile && "hidden" // Hide on mobile view for small logos
						)}
						width={48}
						height={48}
					/>
				</div>
			</SidebarHeader>

			<Separator />

			<SidebarContent className="flex flex-col flex-grow">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="flex flex-col gap-3">
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<Link
										href={item.href}
										passHref
										legacyBehavior
										prefetch
									>
										<SidebarMenuButton
											asChild
											variant="outline"
											size={"lg"}
											isActive={
												pathname.split("/")[1] ===
												item.href.split("/")[1]
											}
											className="w-full flex flex-row items-center h-12 justify-center data-[active=true]:bg-primary/20 data-[active=true]:shadow-primary/50 data-[active=true]:text-primary"
										>
											<a>
												<item.icon
													className={cn(
														state === "collapsed"
															? "h-6 w-6"
															: "h-4 w-4"
													)}
												/>
												<span
													className={cn(
														"font-semibold",
														state === "collapsed" &&
															!isMobile &&
															"hidden"
													)}
												>
													{item.label}
												</span>
											</a>
										</SidebarMenuButton>
									</Link>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<Separator />

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<UserMenu />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default SideBar;
