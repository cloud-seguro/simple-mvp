import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const activeTeam = teams[0];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/">
          <SidebarMenuButton
            size="lg"
            className={cn(
              "hover:bg-yellow-500 hover:text-black transition-colors"
            )}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-yellow-500 text-black">
              <activeTeam.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-white text-lg">
                SIMPLE
              </span>
              <span className="truncate text-xs text-white">
                Cybersecurity Platform
              </span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
