"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ClientSettingsPage() {
  const { profile, isLoading } = useCurrentUser();
  const searchParams = useSearchParams();
  const showResetPassword = searchParams.get("reset_password") === "true";
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);

  // Set needsPasswordReset based on URL parameter
  useEffect(() => {
    if (showResetPassword) {
      setNeedsPasswordReset(true);
    }
  }, [showResetPassword]);

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
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      {needsPasswordReset && (
        <Card>
          <CardHeader>
            <CardTitle>Establecer nueva contraseña</CardTitle>
            <CardDescription>
              Por favor, establece una nueva contraseña para tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm
              onSuccessCallback={() => setNeedsPasswordReset(false)}
            />
          </CardContent>
        </Card>
      )}

      <SettingsForm />
    </div>
  );
}
