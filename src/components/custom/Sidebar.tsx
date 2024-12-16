"use client";

import React from "react";
import {
  PlayCircle,
  PuzzleIcon as PuzzlePiece,
  Sun,
  Moon,
  LogIn,
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
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "../ui/separator";
import Link from "next/link";

const menuItems = [
  { icon: PlayCircle, label: "Game", href: "/game" },
  { icon: PuzzlePiece, label: "Puzzles", href: "/puzzles" },
];

const SideBar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Sidebar className="border-r bg-[#262421] w-[240px] flex flex-col">
      <SidebarHeader className="p-4 ">
        <div className="flex items-center justify-center">
          <img
            src="/Think-different-Academy_LOGO_oficialni_1_dark-mode.svg"
            alt="Think Different Academy"
            className="h-12 hidden dark:block"
          />
          <img
            src="/Think-different-Academy_LOGO_oficialni_1.svg"
            alt="Think Different Academy"
            className="h-12 dark:hidden"
          />
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent className="flex flex-col flex-grow">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    className="h-14 px-4 w-full transition-colors"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="h-6 w-6" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage alt="User" />
              <AvatarFallback>GU</AvatarFallback>
            </Avatar>
            <span>Guest</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full">
              Sign Up
            </Button>
            <Button variant="outline" className="w-full">
              <LogIn className="mr-2 h-4 w-4" /> Log In
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <span className="dark:hidden flex flex-row items-center">
              <Sun className="mr-2 h-4 w-4" /> Light Mode
            </span>
            <span className="hidden dark:flex flex-row items-center">
              <Moon className="mr-2 h-4 w-4" /> Dark Mode
            </span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
