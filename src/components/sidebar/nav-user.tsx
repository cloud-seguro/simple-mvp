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
                "data-[state=open]:bg-gray-800",
                "hover:bg-gray-800 transition-colors"
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg ring-2 ring-white/20">
                <AvatarImage
                  src={profile.avatarUrl || ""}
                  alt={displayName || user.email || "User"}
                />
                <AvatarFallback className="rounded-lg bg-gray-700 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  {displayName || user.email}
                </span>
                <span className="truncate text-xs text-gray-300">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-300" />
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
                <Avatar className="h-8 w-8 rounded-lg ring-2 ring-primary/10">
                  <AvatarImage
                    src={profile.avatarUrl || ""}
                    alt={displayName || user.email || "User"}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {displayName || user.email}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/settings/account">
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Mi Cuenta
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/evaluations">
                  <User className="mr-2 h-4 w-4" />
                  Mis Evaluaciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut?.()}>
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
