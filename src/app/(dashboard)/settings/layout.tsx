"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import type { LucideIcon } from "lucide-react";
import {
  User as UserIcon,
  Settings as WrenchIcon,
  Bell as BellIcon,
  Palette as PaletteIcon,
  Monitor as MonitorIcon,
} from "lucide-react";

const sidebarNavItems: {
  title: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Profile",
    icon: UserIcon,
    href: "/settings",
  },
  {
    title: "Account",
    icon: WrenchIcon,
    href: "/settings/account",
  },
  {
    title: "Appearance",
    icon: PaletteIcon,
    href: "/settings/appearance",
  },
  {
    title: "Notifications",
    icon: BellIcon,
    href: "/settings/notifications",
  },
  {
    title: "Display",
    icon: MonitorIcon,
    href: "/settings/display",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
} 