"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = React.useState(0);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Convert pathname to breadcrumb-like display
  const formattedPath = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "flex h-16 items-center gap-3 bg-background p-4 sm:gap-4",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
        offset > 10 && fixed ? "shadow" : "shadow-none",
        "flex-wrap",
        className
      )}
      {...props}
    >
      <SidebarTrigger
        variant="outline"
        className="scale-125 sm:scale-100"
        aria-label="Toggle sidebar"
      />
      <Separator orientation="vertical" className="h-6 hidden sm:block" />
      <span className="text-sm font-medium text-muted-foreground truncate max-w-[150px] sm:max-w-full">
        {formattedPath || "Dashboard"}
      </span>

      <div className={cn("flex items-center ml-auto", isMobile && "gap-2")}>
        {children}
      </div>
    </header>
  );
}

Header.displayName = "Header";
