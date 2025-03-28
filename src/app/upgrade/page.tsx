import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UpgradeHeader } from "@/components/upgrade/upgrade-header";
import { SimpleHeader } from "@/components/ui/simple-header";
import { UserRole } from "@prisma/client";

export default async function UpgradePage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the user's profile with retry logic
  let profile = null;
  let retryCount = 0;
  const maxRetries = 3;

  while (!profile && retryCount < maxRetries) {
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { id: true, role: true, firstName: true },
      });

      if (!profile) {
        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
        retryCount++;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      retryCount++;
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // If already a PREMIUM user, redirect to dashboard
  if (
    profile?.role === UserRole.PREMIUM ||
    profile?.role === UserRole.SUPERADMIN
  ) {
    redirect("/dashboard");
  }

  // If no profile after retries, create a basic profile
  if (!profile) {
    try {
      profile = await prisma.profile.create({
        data: {
          userId: user.id,
          role: "FREE",
          active: true,
        },
        select: { id: true, role: true, firstName: true },
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      // Continue with the page even if profile creation fails
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with logo */}
      <header className="p-4 md:p-8 bg-background border-b">
        <div className="h-8">
          <SimpleHeader className="text-primary" />
        </div>
      </header>

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <UpgradeHeader />

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-xl font-semibold mb-4">Plan Gratuito</h2>
              <p className="text-3xl font-bold mb-6">
                $0{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  /mes
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Evaluación básica de ciberseguridad
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Recomendaciones limitadas
                </li>
                <li className="flex items-center text-muted-foreground">
                  <svg
                    className="w-5 h-5 mr-2 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Sin acceso a evaluaciones avanzadas
                </li>
                <li className="flex items-center text-muted-foreground">
                  <svg
                    className="w-5 h-5 mr-2 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Sin acceso al panel de control
                </li>
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Plan Actual
              </Button>
            </div>

            <div className="bg-card rounded-lg p-6 border border-primary shadow-md relative">
              <div className="absolute -top-3 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                Recomendado
              </div>
              <h2 className="text-xl font-semibold mb-4">Plan Premium</h2>
              <p className="text-3xl font-bold mb-6">
                $49{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  /mes
                </span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Evaluación básica de ciberseguridad
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Recomendaciones completas
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Acceso a evaluaciones avanzadas
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Panel con historial de evaluaciones
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Recomendaciones de expertos
                </li>
              </ul>
              <Link href="/api/upgrade/premium">
                <Button className="w-full">Actualizar Ahora</Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              ¿Tienes preguntas sobre nuestros planes? Contacta a nuestro equipo
              de ventas.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contactar Ventas</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
