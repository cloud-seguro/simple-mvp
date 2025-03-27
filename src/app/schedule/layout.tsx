import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar con Especialistas | SIMPLE",
  description:
    "Agenda una consulta con especialistas en ciberseguridad para mejorar la seguridad de tu empresa",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
