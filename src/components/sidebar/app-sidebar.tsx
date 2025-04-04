import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { sidebarData } from "./data/sidebar-data";
import type { NavGroupProps } from "./types";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { useMemo } from "react";
import { Users } from "lucide-react";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useCurrentUser();

  // Add specialists management link for SUPERADMIN users
  const navGroups = useMemo(() => {
    const groups = [...sidebarData.navGroups];

    // If user is SUPERADMIN, add specialists management link
    if (profile?.role === UserRole.SUPERADMIN) {
      // Find or create Admin group
      let adminGroup = groups.find((group) => group.title === "Admin");

      if (!adminGroup) {
        adminGroup = {
          title: "Admin",
          items: [],
        };
        groups.push(adminGroup);
      }

      // Add specialists management link
      adminGroup.items.push({
        title: "Especialistas",
        url: "/specialists",
        icon: Users,
      });
    }

    return groups;
  }, [profile?.role]);

  return (
    <Sidebar
      collapsible="icon"
      className={cn("text-white", className)}
      {...props}
    >
      <SidebarHeader className="bg-black">
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-black">
        {navGroups.map((props: NavGroupProps) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
