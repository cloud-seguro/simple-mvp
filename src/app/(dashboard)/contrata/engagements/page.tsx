import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus } from "@prisma/client";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import { SERVICE_PACKAGE_NAMES } from "@/lib/constants/service-packages";

export const metadata = {
  title: "Mis Contratos | CONTRATA | SIMPLE",
  description: "Gestiona tus contratos con especialistas",
};

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

// Helper function to get status badge styling
const getStatusBadgeClass = (status: EngagementStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-accent text-accent-foreground";
    case "ACCEPTED":
      return "bg-accent text-accent-foreground";
    case "REJECTED":
      return "bg-destructive/10 text-destructive";
    case "IN_PROGRESS":
      return "bg-primary/10 text-primary";
    case "COMPLETED":
      return "bg-[hsl(var(--chart-2))] text-white";
    case "CANCELLED":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Helper function to translate status
const translateStatus = (status: EngagementStatus) => {
  switch (status) {
    case "PENDING":
      return "PENDIENTE";
    case "ACCEPTED":
      return "ACEPTADO";
    case "REJECTED":
      return "RECHAZADO";
    case "IN_PROGRESS":
      return "EN PROGRESO";
    case "COMPLETED":
      return "COMPLETADO";
    case "CANCELLED":
      return "CANCELADO";
    default:
      return status;
  }
};

export default async function EngagementsPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Get the user's profile to check their role
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, role: true },
  });

  // If not a PREMIUM or SUPERADMIN user, redirect to dashboard
  if (
    !profile ||
    (profile.role !== UserRole.PREMIUM && profile.role !== UserRole.SUPERADMIN)
  ) {
    redirect("/dashboard");
  }

  // Fetch user's engagements
  const engagements = await prisma.engagement.findMany({
    where: {
      profileId: profile.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      budget: true,
      startDate: true,
      createdAt: true,
      servicePackage: true,
      urgency: true,
      specialist: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          expertiseAreas: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Group engagements by status for better organization
  const groupedEngagements = engagements.reduce(
    (groups, engagement) => {
      const status = engagement.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(engagement);
      return groups;
    },
    {} as Record<EngagementStatus, typeof engagements>
  );

  // Order for status display
  const statusOrder: EngagementStatus[] = [
    "IN_PROGRESS",
    "PENDING",
    "ACCEPTED",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Mis Contratos con Especialistas
        </h1>
        <p className="text-muted-foreground">
          Gestiona y realiza seguimiento de tus contratos con especialistas en
          ciberseguridad.
        </p>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Todos los Contratos</h2>
          <Link
            href="/contrata"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Contratar Nuevo Especialista
          </Link>
        </div>

        {engagements.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium">Sin contratos todavía</h3>
            <p className="mt-1 text-muted-foreground">
              Aún no has contratado a ningún especialista. Comienza contratando
              un especialista.
            </p>
            <div className="mt-6">
              <Link
                href="/contrata"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
              >
                Buscar un Especialista
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {statusOrder.map((status) => {
              if (
                !groupedEngagements[status] ||
                groupedEngagements[status].length === 0
              )
                return null;

              return (
                <div key={status} className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    {translateStatus(status)} (
                    {groupedEngagements[status].length})
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {groupedEngagements[status].map((engagement) => (
                      <Link
                        key={engagement.id}
                        href={`/contrata/engagements/${engagement.id}`}
                        className="border rounded-lg p-4 hover:shadow-md transition flex flex-col md:flex-row md:items-center"
                      >
                        <div className="flex items-center mb-4 md:mb-0 md:mr-6">
                          {engagement.specialist.imageUrl ? (
                            <Image
                              src={engagement.specialist.imageUrl}
                              alt={engagement.specialist.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted mr-4 flex items-center justify-center text-muted-foreground">
                              <span className="text-lg">👤</span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{engagement.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Con: {engagement.specialist.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex-grow md:text-right space-y-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(engagement.status)}`}
                          >
                            {translateStatus(engagement.status)}
                          </span>
                          {engagement.servicePackage && (
                            <p className="text-sm text-muted-foreground">
                              Servicio:{" "}
                              {SERVICE_PACKAGE_NAMES[
                                engagement.servicePackage
                              ] || engagement.servicePackage}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Creado:{" "}
                            {format(
                              new Date(engagement.createdAt),
                              "d 'de' MMM, yyyy",
                              { locale: es }
                            )}
                          </p>
                          {engagement.budget && (
                            <p className="text-sm font-medium">
                              Presupuesto: ${engagement.budget}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
