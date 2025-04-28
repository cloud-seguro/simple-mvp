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
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Create a separate client component that uses useSearchParams
function VerifyEmailContent() {
  const [email, setEmail] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from URL query parameter
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  return (
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
              Hemos enviado un correo de verificación a <strong>{email}</strong>
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
  );
}

// Loading fallback for Suspense
function VerifyEmailFallback() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">
          Verifica tu correo electrónico
        </CardTitle>
        <CardDescription>Cargando información...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="flex flex-col space-y-2">
          <Button className="w-full" variant="outline" asChild>
            <Link href="/sign-in">Volver a Iniciar Sesión</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component with Suspense boundary
export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
