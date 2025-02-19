"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  PlayCircle,
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
import { UserMenu } from "./UserMenu";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PlayCircle, label: "Play", href: "/game" },
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
            src="/TDA/Think-different-Academy_LOGO_oficialni_1_dark-mode.svg"
            alt="Think Different Academy"
            className={cn(
              "h-12 hidden",
              state !== "collapsed" && !isMobile && "dark:block", // Show when not collapsed, dark mode
              isMobile && "block", // Show on mobile
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
              !isMobile && "block", // Show on non-mobile when not collapsed
            )}
          />
          <Image
            src="/TDA/Think-different-Academy_LOGO_erb.svg"
            alt="Think Different Academy"
            className={cn(
              state === "collapsed" ? "p-[2.0px]" : "hidden", // Show on dark mode when collapsed
              isMobile && "hidden", // Hide on mobile view for small logos
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
                            state === "collapsed" && !isMobile && "hidden",
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
