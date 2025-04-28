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
              {specialist.imageUrl ? (
                <Image
                  src={specialist.imageUrl}
                  alt={specialist.name}
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
              <h1 className="text-2xl font-bold">{specialist.name}</h1>
              {specialist.location && (
                <p className="text-muted-foreground mb-2">
                  {specialist.location}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {specialist.expertiseAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full"
                  >
                    {translateExpertiseArea(area)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Acerca de</h2>
            <p className="text-foreground whitespace-pre-line">
              {specialist.bio}
            </p>
          </div>

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
                <span>{specialist.contactEmail}</span>
              </p>
              {specialist.contactPhone && (
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-muted-foreground"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>{specialist.contactPhone}</span>
                </p>
              )}
              {specialist.website && (
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-muted-foreground"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <a
                    href={
                      specialist.website.startsWith("http")
                        ? specialist.website
                        : `https://${specialist.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    {specialist.website}
                  </a>
                </p>
              )}
            </div>
          </div>

          {specialist.deals.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Paquetes de Servicios
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialist.deals.map((deal) => (
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
                        href={`/contrata/hire/${specialist.id}?dealId=${deal.id}`}
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
              href={`/contrata/hire/${specialist.id}`}
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
