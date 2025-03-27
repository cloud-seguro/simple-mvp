"use client";

import Link from "next/link";
import {
  BadgeCheck,
  LogOut,
  Settings,
  User,
  ChevronsUpDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { profile, user, signOut } = useAuth();

  if (!profile || !user) return null;

  const displayName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");

  const getInitials = () => {
    if (profile.firstName || profile.lastName) {
      return [profile.firstName?.[0], profile.lastName?.[0]]
        .filter(Boolean)
        .join("")
        .toUpperCase();
    }
    return user.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-yellow-500 data-[state=open]:text-black",
                "hover:bg-yellow-500 hover:text-black transition-colors"
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-white/20">
                <AvatarImage
                  src={profile.avatarUrl || ""}
                  alt={displayName || user.email || "User"}
                />
                <AvatarFallback className="rounded-lg bg-yellow-500 text-black">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  {displayName || user.email}
                </span>
                <span className="truncate text-xs text-white">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-white" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-black border-yellow-500"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg ring-2 ring-yellow-500/50">
                  <AvatarImage
                    src={profile.avatarUrl || ""}
                    alt={displayName || user.email || "User"}
                  />
                  <AvatarFallback className="rounded-lg bg-yellow-500 text-black">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">
                    {displayName || user.email}
                  </span>
                  <span className="truncate text-xs text-white">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-yellow-500" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="text-white hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black"
              >
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="text-white hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black"
              >
                <Link href="/evaluations">
                  <User className="mr-2 h-4 w-4" />
                  Mis Evaluaciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-yellow-500" />
              <DropdownMenuItem
                onClick={() => signOut?.()}
                className="text-white hover:bg-yellow-500 hover:text-black focus:bg-yellow-500 focus:text-black"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
