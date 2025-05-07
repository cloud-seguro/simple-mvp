"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SettingsForm } from "./settings-form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="h-8 w-36 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="h-5 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <Tabs defaultValue="loading" className="space-y-6">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="loading" disabled>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            </TabsTrigger>
            <TabsTrigger value="loading2" disabled>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            </TabsTrigger>
            <TabsTrigger value="loading3" disabled>
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="loading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                </CardTitle>
                <CardDescription>
                  <div className="h-4 w-72 bg-gray-200 animate-pulse rounded"></div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
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
