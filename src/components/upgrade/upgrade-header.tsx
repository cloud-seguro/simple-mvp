"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";

export function UpgradeHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Actualiza a Premium</h1>
        <p className="text-muted-foreground">
          Obtén acceso a evaluaciones avanzadas y más funciones
        </p>
      </div>
      <SignOutButton />
    </div>
  );
}
