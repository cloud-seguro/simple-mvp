import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Detalles del Especialista | CONTRATA | SIMPLE",
  description:
    "Ver detalles sobre un especialista en ciberseguridad y sus servicios",
};

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export default async function SpecialistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const specialistId = (await params).id;

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

  // Fetch specialist details
  const specialist = await prisma.specialist.findUnique({
    where: {
      id: specialistId,
      active: true,
    },
    include: {
      deals: {
        where: {
          active: true,
        },
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!specialist) {
    notFound();
  }

  // Type assertion to handle the new schema fields
  type SpecialistWithDeals = typeof specialist & {
    hourlyRate?: number | null;
    linkedinProfileUrl?: string | null;
    skills?: string[];
  };

  const specialistWithNewFields = specialist as SpecialistWithDeals;

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/contrata"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Volver a todos los especialistas
      </Link>

      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              {specialistWithNewFields.imageUrl ? (
                <Image
                  src={specialistWithNewFields.imageUrl}
                  alt={specialistWithNewFields.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <span className="text-4xl">👤</span>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {specialistWithNewFields.name}
              </h1>
              {specialistWithNewFields.location && (
                <p className="text-muted-foreground mb-2">
                  {specialistWithNewFields.location}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {specialistWithNewFields.expertiseAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full"
                  >
                    {translateExpertiseArea(area)}
                  </span>
                ))}
              </div>
              {specialistWithNewFields.hourlyRate && (
                <p className="mt-3 text-lg font-medium text-primary">
                  ${specialistWithNewFields.hourlyRate}/hora
                </p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Acerca de</h2>
            <p className="text-foreground whitespace-pre-line">
              {specialistWithNewFields.bio}
            </p>
          </div>

          {specialistWithNewFields.skills &&
            specialistWithNewFields.skills.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Habilidades</h2>
                <div className="flex flex-wrap gap-2">
                  {specialistWithNewFields.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-2">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-muted-foreground"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <Link
                  href={`/contrata/hire/${specialistWithNewFields.id}`}
                  className="text-primary hover:text-primary/80"
                >
                  Contactar a través de SIMPLE
                </Link>
              </p>
              {specialistWithNewFields.linkedinProfileUrl && (
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-muted-foreground"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <a
                    href={specialistWithNewFields.linkedinProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    Perfil de LinkedIn
                  </a>
                </p>
              )}
            </div>
          </div>

          {specialistWithNewFields.deals.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Paquetes de Servicios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialistWithNewFields.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="border rounded-lg p-6 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-medium mb-2">{deal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {deal.description}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${deal.price}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Duración: {deal.durationDays} días
                        </p>
                      </div>
                      <Link
                        href={`/contrata/hire/${specialistWithNewFields.id}?dealId=${deal.id}`}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
                      >
                        Seleccionar Paquete
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link
              href={`/contrata/hire/${specialistWithNewFields.id}`}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition text-center"
            >
              Contratar Este Especialista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to translate expertise areas to Spanish
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
