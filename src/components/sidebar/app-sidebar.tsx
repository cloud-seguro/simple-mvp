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
import { useMemo, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Users, FileText, Shield, LineChart, UserPlus } from "lucide-react";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useCurrentUser();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Add specialists management link for SUPERADMIN users
  const navGroups = useMemo(() => {
    const groups = [...sidebarData.navGroups];

    // Add Add-ons section for PREMIUM and SUPERADMIN users
    if (
      profile?.role === UserRole.PREMIUM ||
      profile?.role === UserRole.SUPERADMIN
    ) {
      // Find or create Add-ons group
      let addonsGroup = groups.find((group) => group.title === "Add-ons");

      if (!addonsGroup) {
        addonsGroup = {
          title: "Add-ons",
          items: [],
        };
        groups.push(addonsGroup);
      }

      // Add BREACH link (available for both PREMIUM and SUPERADMIN)
      addonsGroup.items.push({
        title: "BREACH",
        url: "/breach-verification",
        icon: Shield,
      });

      // Add CONTRATA link
      addonsGroup.items.push({
        title: "CONTRATA",
        url: "/contrata",
        icon: UserPlus,
      });
    }

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

      // Add admin evaluations link
      adminGroup.items.push({
        title: "Todas las Evaluaciones",
        url: "/admin/evaluations",
        icon: LineChart,
      });

      // Add specialists management link
      adminGroup.items.push({
        title: "Especialistas",
        url: "/specialists",
        icon: Users,
      });

      // Add blog management link
      adminGroup.items.push({
        title: "Blog",
        url: "/dashboard/blog",
        icon: FileText,
      });
    }

    return groups;
  }, [profile?.role]);

  // Initial sidebar state management based on screen size
  useEffect(() => {
    // This will be handled by the SidebarProvider via the collapsible prop
    // The sidebar will start collapsed on mobile
  }, [isMobile]);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "text-white transition-all duration-300 ease-in-out",
        isMobile ? "z-50" : "",
        className
      )}
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
