import {
  AlertCircle,
  AppWindow,
  AudioWaveform,
  Ban,
  BellRing,
  Monitor,
  Bug,
  CheckSquare,
  Command,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Lock,
  LockKeyhole,
  MessageSquare,
  Palette,
  Settings,
  ServerCrash,
  Wrench,
  UserCog,
  UserX,
  Users,
  FileBarChart,
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
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Evaluaciones",
          url: "/evaluations",
          icon: FileBarChart,
        },
        {
          title: "Tareas",
          url: "/tasks",
          icon: CheckSquare,
        },
        {
          title: "Aplicaciones",
          url: "/apps",
          icon: AppWindow,
        },
        {
          title: "Chats",
          url: "/chats",
          badge: "3",
          icon: MessageSquare,
        },
        {
          title: "Usuarios",
          url: "/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Páginas",
      items: [
        {
          title: "Autenticación",
          icon: Lock,
          items: [
            {
              title: "Iniciar Sesión",
              url: "/sign-in",
            },
            {
              title: "Iniciar Sesión (2 Col)",
              url: "/sign-in-2",
            },
            {
              title: "Registrarse",
              url: "/sign-up",
            },
            {
              title: "Olvidé mi Contraseña",
              url: "/forgot-password",
            },
            {
              title: "OTP",
              url: "/otp",
            },
          ],
        },
        {
          title: "Errores",
          icon: Bug,
          items: [
            {
              title: "No Autorizado",
              url: "/401",
              icon: LockKeyhole,
            },
            {
              title: "Prohibido",
              url: "/403",
              icon: UserX,
            },
            {
              title: "No Encontrado",
              url: "/404",
              icon: AlertCircle,
            },
            {
              title: "Error Interno del Servidor",
              url: "/500",
              icon: ServerCrash,
            },
            {
              title: "Error de Mantenimiento",
              url: "/503",
              icon: Ban,
            },
          ],
        },
      ],
    },
    {
      title: "Otros",
      items: [
        {
          title: "Configuración",
          icon: Settings,
          items: [
            {
              title: "Perfil",
              url: "/settings",
              icon: UserCog,
            },
            {
              title: "Cuenta",
              url: "/settings/account",
              icon: Wrench,
            },
            {
              title: "Apariencia",
              url: "/settings/appearance",
              icon: Palette,
            },
            {
              title: "Notificaciones",
              url: "/settings/notifications",
              icon: BellRing,
            },
            {
              title: "Pantalla",
              url: "/settings/display",
              icon: Monitor,
            },
          ],
        },
        {
          title: "Centro de Ayuda",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
