import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export const metadata = {
  title: "CONTRATA - Contrata Especialistas | SIMPLE",
  description:
    "Encuentra y contrata especialistas en ciberseguridad para cubrir tus necesidades",
};

export default async function ContrataPage() {
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

  // Fetch all active specialists
  const specialists = await prisma.specialist.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      bio: true,
      expertiseAreas: true,
      imageUrl: true,
      location: true,
      deals: {
        where: {
          active: true,
        },
        select: {
          id: true,
          title: true,
          price: true,
          durationDays: true,
        },
        take: 2, // Just show a few deals per specialist in the list view
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch user's existing engagements
  const engagements = await prisma.engagement.findMany({
    where: {
      profileId: profile.id,
    },
    select: {
      id: true,
      title: true,
      status: true,
      specialist: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5, // Only show recent engagements
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          CONTRATA - Contrata Especialistas en Seguridad
        </h1>
        <p className="text-muted-foreground">
          Encuentra y contrata a los mejores especialistas en ciberseguridad
          para ayudarte con tus necesidades.
        </p>
      </div>

      {/* Active engagements section */}
      {engagements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tus Contratos Activos</h2>
          <div className="grid grid-cols-1 gap-4">
            {engagements.map((engagement) => (
              <Link
                key={engagement.id}
                href={`/contrata/engagements/${engagement.id}`}
                className="block p-4 border rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-center">
                  {engagement.specialist.imageUrl && (
                    <User/>
                  )}
                  <div>
                    <h3 className="font-medium">{engagement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Con: {engagement.specialist.name} • Estado:{" "}
                      {translateStatus(engagement.status)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/contrata/engagements"
              className="text-primary hover:text-primary/80 font-medium"
            >
              Ver todos los contratos →
            </Link>
          </div>
        </div>
      )}

      {/* Available specialists section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Especialistas Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialists.map((specialist) => (
            <div
              key={specialist.id}
              className="border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="flex items-center mb-4">
                {specialist.imageUrl ? (
                  <Image
                    src={specialist.imageUrl}
                    alt={specialist.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-muted mr-4 flex items-center justify-center text-muted-foreground">
                    <span className="text-xl">👤</span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium">{specialist.name}</h3>
                  {specialist.location && (
                    <p className="text-sm text-muted-foreground">
                      {specialist.location}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-foreground mb-4 line-clamp-3">
                {specialist.bio}
              </p>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {specialist.expertiseAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                    >
                      {translateExpertiseArea(area)}
                    </span>
                  ))}
                </div>
              </div>

              {specialist.deals.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">
                    Paquetes Disponibles:
                  </h4>
                  <ul className="space-y-2">
                    {specialist.deals.map((deal) => (
                      <li
                        key={deal.id}
                        className="text-sm flex justify-between"
                      >
                        <span>{deal.title}</span>
                        <span className="font-medium">${deal.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-4">
                <Link
                  href={`/contrata/specialists/${specialist.id}`}
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  Ver Perfil
                </Link>
                <Link
                  href={`/contrata/hire/${specialist.id}`}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition"
                >
                  Contratar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper functions to translate status and expertise areas to Spanish
function translateStatus(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Pendiente",
    ACCEPTED: "Aceptado",
    REJECTED: "Rechazado",
    IN_PROGRESS: "En Progreso",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  };

  return statusMap[status] || status;
}

function translateExpertiseArea(area: string): string {
  const areaMap: Record<string, string> = {
    NETWORK_SECURITY: "Seguridad de Red",
    APPLICATION_SECURITY: "Seguridad de Aplicaciones",
    CLOUD_SECURITY: "Seguridad en la Nube",
    INCIDENT_RESPONSE: "Respuesta a Incidentes",
    SECURITY_ASSESSMENT: "Evaluación de Seguridad",
    COMPLIANCE: "Cumplimiento Normativo",
    SECURITY_TRAINING: "Formación en Seguridad",
    SECURITY_ARCHITECTURE: "Arquitectura de Seguridad",
    DATA_PROTECTION: "Protección de Datos",
    GENERAL: "General",
  };

  return areaMap[area] || area.replace(/_/g, " ");
}
