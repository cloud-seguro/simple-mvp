import { Suspense } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { EvaluationsList } from "./components/evaluations-list";
import { CompareEvaluationsButton } from "./components/compare-evaluations-button";

export const metadata = {
  title: "Historial de Evaluaciones | Dashboard",
  description:
    "Visualiza y compara tus evaluaciones de ciberseguridad anteriores",
};

async function EvaluationsContent() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold">Sesión no encontrada</h2>
        <p className="text-muted-foreground">
          Por favor inicia sesión para ver tus evaluaciones
        </p>
      </div>
    );
  }

  // Get the user's profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold">Perfil no encontrado</h2>
        <p className="text-muted-foreground">
          No se pudo encontrar tu perfil de usuario
        </p>
      </div>
    );
  }

  // Get the user's evaluations
  const evaluations = await prisma.evaluation.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CompareEvaluationsButton evaluations={evaluations} />
      </div>
      <EvaluationsList evaluations={evaluations} />
    </div>
  );
}

export default function EvaluationsPage() {
  return (
    <div className="container py-8">
      <Suspense
        fallback={<SecurityLoadingScreen message="Cargando evaluaciones..." />}
      >
        <EvaluationsContent />
      </Suspense>
    </div>
  );
}
