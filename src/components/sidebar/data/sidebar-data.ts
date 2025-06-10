import { LayoutDashboard, FileBarChart, Command } from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "SIMPLE",
      logo: Command,
      plan: "Cybersecurity Platform",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Evaluaciones",
          url: "/evaluations",
          icon: FileBarChart,
        },
      ],
    },
  ],
};
