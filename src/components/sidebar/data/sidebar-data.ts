import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  Command,
  UserCircle
} from "lucide-react";
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
        {
          title: "Contrata",
          url: "/contrata",
          icon: UserCircle,
        },
      ],
    },
    {
      title: "Configuración",
      items: [
        {
          title: "Ajustes",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
};
