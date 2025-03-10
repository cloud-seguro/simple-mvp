"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Bienvenido, {userName}</h2>
        <SignOutButton />
      </div>
      <p className="text-muted-foreground">
        Este es tu panel premium donde puedes ver tu historial de evaluaciones y
        acceder a funciones avanzadas.
      </p>
    </div>
  );
}
