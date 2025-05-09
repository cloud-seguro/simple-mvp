import { Suspense } from "react";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { AdminEvaluationsList } from "./components/admin-evaluations-list";
import { EvaluationAnalytics } from "./components/evaluation-analytics";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestión de Evaluaciones | Admin Dashboard",
  description:
    "Panel de administración para la gestión de todas las evaluaciones",
};

async function AdminEvaluationsContent() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Get the user's profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, firstName: true, lastName: true, role: true },
  });

  if (!profile) {
    redirect("/sign-in");
  }

  // Check if user is a superadmin
  if (profile.role !== UserRole.SUPERADMIN) {
    redirect("/dashboard");
  }

  // Get all evaluations with profile information
  const evaluations = await prisma.evaluation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          company: true,
        },
      },
    },
  });

  // Split evaluations by type
  const initialEvaluations = evaluations.filter((e) => e.type === "INITIAL");
  const advancedEvaluations = evaluations.filter((e) => e.type === "ADVANCED");
  const guestEvaluations = evaluations.filter(
    (e) => !e.profileId && e.guestEmail
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        Panel de Administración de Evaluaciones
      </h1>
      <p className="text-muted-foreground">
        Vista general de todas las evaluaciones en la plataforma
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg">Total Evaluaciones</h3>
          <p className="text-3xl font-bold">{evaluations.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg">Evaluaciones Iniciales</h3>
          <p className="text-3xl font-bold">{initialEvaluations.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg">Evaluaciones Avanzadas</h3>
          <p className="text-3xl font-bold">{advancedEvaluations.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg">Evaluaciones de Invitados</h3>
          <p className="text-3xl font-bold">{guestEvaluations.length}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Usuarios que han completado evaluaciones sin registro en la
            plataforma
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="font-medium text-lg">Conversión de Invitados</h3>
          <p className="text-3xl font-bold">
            {guestEvaluations.length
              ? Math.round(
                  (guestEvaluations.filter((e) => e.profileId).length /
                    guestEvaluations.length) *
                    100
                )
              : 0}
            %
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Porcentaje de invitados que se han registrado después de la
            evaluación
          </p>
        </div>
      </div>

      <div className="mb-10">
        <EvaluationAnalytics evaluations={evaluations} />
      </div>

      <AdminEvaluationsList
        allEvaluations={evaluations}
        initialEvaluations={initialEvaluations}
        advancedEvaluations={advancedEvaluations}
        guestEvaluations={guestEvaluations}
      />
    </div>
  );
}

export default function AdminEvaluationsPage() {
  return (
    <div className="container py-8">
      <Suspense>
        <AdminEvaluationsContent />
      </Suspense>
    </div>
  );
}
