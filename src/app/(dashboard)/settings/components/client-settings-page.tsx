"use client";

import { SettingsForm } from "./settings-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";

export function ClientSettingsPage() {
  const { profile, isLoading } = useCurrentUser();

  if (isLoading) {
    return <SecurityLoadingScreen message="Cargando configuración..." />;
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">
            No se pudo cargar tu perfil. Por favor, intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <SettingsForm />
    </div>
  );
}
