import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  Command,
  UserCircle,
  FileCheck,
  ListChecks,
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
          items: [
            {
              title: "Especialistas",
              url: "/contrata/specialists",
              icon: UserCircle,
            },
            {
              title: "Contratos",
              url: "/contrata/engagements",
              icon: FileCheck,
            },
            {
              title: "Contratar",
              url: "/contrata/hire",
              icon: ListChecks,
            },
          ],
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
