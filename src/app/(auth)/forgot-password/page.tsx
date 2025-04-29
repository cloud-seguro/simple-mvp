import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password/forgot-password-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Iniciar Sesión con Enlace Mágico",
  description:
    "Inicie sesión con un enlace mágico para restablecer su contraseña",
};

export default async function ForgotPasswordPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthLayout>
      <Card className="p-6">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-semibold tracking-tight">
            Iniciar Sesión con Enlace Mágico
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingrese su correo electrónico a continuación para recibir un enlace
            mágico para iniciar sesión y restablecer su contraseña.
          </p>
        </div>
        <ForgotPasswordForm />
        <div className="mt-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="/sign-in">Volver a Iniciar Sesión</Link>
          </Button>
        </div>
      </Card>
    </AuthLayout>
  );
}
