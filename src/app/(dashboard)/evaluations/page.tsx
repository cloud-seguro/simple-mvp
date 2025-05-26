import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { EvaluationsClient } from "./components/evaluations-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Historial de Evaluaciones | Dashboard",
  description:
    "Visualiza y compara tus evaluaciones de ciberseguridad anteriores",
};

export default async function EvaluationsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold">Sesión no encontrada</h2>
          <p className="text-muted-foreground">
            Por favor inicia sesión para ver tus evaluaciones
          </p>
        </div>
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
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold">Perfil no encontrado</h2>
          <p className="text-muted-foreground">
            No se pudo encontrar tu perfil de usuario
          </p>
        </div>
      </div>
    );
  }

  // Get the user's evaluations with default descending order
  const evaluations = await prisma.evaluation.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Historial de Evaluaciones</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y compara tus evaluaciones de ciberseguridad
        </p>
      </div>
      <EvaluationsClient evaluations={evaluations} />
    </div>
  );
}
