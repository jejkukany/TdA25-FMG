"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  PlayCircle,
  PuzzleIcon as PuzzlePiece,
  LogOut,
  Home,
  Settings,
  User,
  ChevronsUpDown,
  Sun,
  Moon,
  Grid,
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
  SidebarMenuItem,
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
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PlayCircle, label: "Game", href: "/game" },
  { icon: Grid, label: "Games", href: "/games" },
];

const SideBar = () => {
  const { theme, setTheme } = useTheme();
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
              : "justify-center",
          )}
        >
          <Image
            src="/Think-different-Academy_LOGO_oficialni_1_dark-mode.svg"
            alt="Think Different Academy"
            className={cn("h-12 hidden", state !== "collapsed" && "dark:block")}
            fill
          />
          <Image
            src="/Think-different-Academy_LOGO_oficialni_1.svg"
            alt="Think Different Academy"
            fill
            className={cn(
              "h-12 dark:hidden",
              state === "collapsed" && "hidden",
            )}
          />
          <Image
            src="/Think-different-Academy_LOGO_erb.svg"
            alt="Think Different Academy"
            className={cn(state === "collapsed" ? "block p-[2.0px]" : "hidden")}
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
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      asChild
                      variant="outline"
                      className={cn(
                        "w-full flex flex-row items-center h-12 justify-center",
                        "/" + pathname.split("/")[1] === item.href &&
                          "bg-accent text-accent-foreground border-none",
                      )}
                    >
                      <a>
                        <item.icon
                          className={cn(
                            state === "collapsed" ? "h-6 w-6" : "h-4 w-4",
                          )}
                        />
                        <span
                          className={cn(
                            "font-semibold",
                            state === "collapsed" && "hidden",
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage alt="User" />
                    <AvatarFallback>GU</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Guest</span>
                    <span className="truncate text-xs">guest@example.com</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-12 w-12 rounded-lg">
                      <AvatarImage alt="User" />
                      <AvatarFallback>GU</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Guest</span>
                      <span className="truncate text-xs">
                        guest@example.com
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center justify-between cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    setTheme(theme === "dark" ? "light" : "dark");
                  }}
                >
                  <div className="flex items-center">
                    {theme === "dark" ? (
                      <Moon className="mr-2 h-4 w-4" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                  </div>
                  <Switch checked={theme === "dark"} />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log In</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
