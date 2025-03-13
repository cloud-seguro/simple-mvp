"use client";

import { cn } from "@/lib/utils";
import { SearchProvider } from "@/context/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import SkipToMain from "@/components/skip-to-main";
import { Header } from "@/components/sidebar/header";
import { Search } from "@/components/sidebar/search";
import { ThemeSwitch } from "@/components/sidebar/theme-switch";
import { ProfileDropdown } from "@/components/sidebar/profile-dropdown";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayoutClient({ children }: DashboardLayoutProps) {
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={true}>
        <SkipToMain />
        <AppSidebar className="fixed inset-y-0 left-0 z-20" />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "transition-[width] duration-200 ease-linear",
            "flex min-h-screen flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:min-h-screen"
          )}
        >
          <Header>
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <div className="flex-1 p-6">{children}</div>
        </div>
      </SidebarProvider>
    </SearchProvider>
  );
} 