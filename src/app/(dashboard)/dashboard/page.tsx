import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

// Define a simple type for evaluations
type SimpleEvaluation = {
  id: string;
  type: string;
  title: string;
  score: number | null;
  profileId: string;
  createdAt: Date;
  completedAt: Date | null;
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the user's profile for name and evaluations
  // We don't need to check role here as it's already checked in the layout
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!profile) {
    // This shouldn't happen since we check in the layout, but just in case
    redirect("/upgrade");
  }

  // Get the user's evaluations with a type assertion
  const evaluations = (await prisma.$queryRaw`
    SELECT id, type, title, score, "profileId", "createdAt", "completedAt"
    FROM evaluations
    WHERE "profileId" = ${profile.id}
    ORDER BY "createdAt" DESC
  `) as SimpleEvaluation[];

  const userName = profile.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`
    : "Usuario";

  return (
    <div className="space-y-8">
      <DashboardHeader userName={userName} />

      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tus Evaluaciones</h2>
        {evaluations.length > 0 ? (
          <div className="space-y-4">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{evaluation.title}</h3>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                    {evaluation.type === "INITIAL" ? "Inicial" : "Avanzada"}
                  </span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Completada el{" "}
                  {new Date(
                    evaluation.completedAt || evaluation.createdAt
                  ).toLocaleDateString("es-ES")}
                </div>
                <div className="mt-2">
                  Puntuación:{" "}
                  <span className="font-semibold">
                    {evaluation.score || "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            Aún no has completado ninguna evaluación.
          </p>
        )}
      </div>
    </div>
  );
}
