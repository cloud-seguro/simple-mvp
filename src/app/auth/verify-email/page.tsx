"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Try to get the email from localStorage if available
    const pendingProfileData = localStorage.getItem("pendingProfileData");
    if (pendingProfileData) {
      try {
        const profileData = JSON.parse(pendingProfileData);
        if (profileData.email) {
          setEmail(profileData.email);
        }
      } catch (e) {
        console.error("Error parsing pendingProfileData:", e);
      }
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">
            Verifica tu correo electrónico
          </CardTitle>
          <CardDescription>
            {email ? (
              <>
                Hemos enviado un correo de verificación a{" "}
                <strong>{email}</strong>
              </>
            ) : (
              "Hemos enviado un correo de verificación a tu dirección de email"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Por favor, revisa tu bandeja de entrada y haz clic en el enlace de
            verificación para activar tu cuenta.
          </p>
          <p className="text-sm text-muted-foreground">
            Si no recibiste el correo, revisa tu carpeta de spam o solicita un
            nuevo enlace.
          </p>
          <div className="flex flex-col space-y-2">
            <Button className="w-full" variant="outline" asChild>
              <Link href="/sign-in">Volver a Iniciar Sesión</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
