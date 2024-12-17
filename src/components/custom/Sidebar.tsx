"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  PlayCircle,
  PuzzleIcon as PuzzlePiece,
  LogIn,
  Home,
  Settings,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PlayCircle, label: "Game", href: "/game" },
  { icon: PuzzlePiece, label: "Puzzles", href: "/puzzles" },
];

const SideBar = () => {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar
      className="border-r bg-[#262421] flex flex-col overflow-hidden"
      collapsible="icon"
    >
      <SidebarHeader>
        <div
          className={clsx(
            "h-[48px] w-[160px] flex items-center relative",
            state === "collapsed"
              ? "justify-left pl-[1.2px]"
              : "justify-center",
          )}
        >
          <Image
            src="/Think-different-Academy_LOGO_oficialni_1_dark-mode.svg"
            alt="Think Different Academy"
            className={clsx(
              "h-12 hidden",
              state !== "collapsed" && "dark:block",
            )}
            fill
          />
          <Image
            src="/Think-different-Academy_LOGO_oficialni_1.svg"
            alt="Think Different Academy"
            fill
            className={clsx(
              "h-12 dark:hidden",
              state === "collapsed" && "hidden",
            )}
          />
          <Image
            src="/Think-different-Academy_LOGO_erb.svg"
            alt="Think Different Academy"
            className={clsx(
              state === "collapsed" ? "block p-[2.0px]" : "hidden",
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
                <Link href={item.href} key={item.label}>
                  <SidebarMenuButton
                    variant="outline"
                    className={clsx(
                      "w-full flex flex-row items-center h-12 justify-center",
                      "/" + pathname.split("/")[1] === item.href &&
                        "bg-accent text-accent-foreground border-none",
                    )}
                  >
                    <item.icon
                      className={clsx(
                        state === "collapsed" ? "h-6 w-6" : "h-4 w-4",
                      )}
                    />
                    <span
                      className={clsx(
                        "font-semibold",
                        state === "collapsed" && "hidden",
                      )}
                    >
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator />

      <SidebarFooter className="flex flex-col gap-4">
        <div
          className={clsx(
            state === "collapsed" ? "flex-col" : "flex-row",
            "flex justify-between items-center",
          )}
        >
          <div className="flex items-center gap-3">
            <Avatar
              className={clsx(state === "collapsed" ? "hidden" : "h-12 w-12")}
            >
              <AvatarImage alt="User" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <span className={clsx(state === "collapsed" && "hidden")}>
              Guest
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-12 justify-center w-12">
              <div>
                <SidebarMenuButton
                  variant="outline"
                  className={clsx(
                    state === "collapsed" ? "hidden" : "flex",
                    "h-12 w-12 items-center align-middle justify-center gap-2",
                  )}
                >
                  <Settings />
                </SidebarMenuButton>
                <div className="flex items-center gap-3">
                  <Avatar
                    className={clsx(
                      state === "collapsed" ? "h-12 w-12" : "hidden",
                    )}
                  >
                    <AvatarImage alt="User" />
                    <AvatarFallback>GU</AvatarFallback>
                  </Avatar>
                  <span className={clsx(state === "collapsed" ? "" : "hidden")}>
                    Guest
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className=" w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogIn className="mr-2 h-4 w-4" />
                <span>Log In</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
