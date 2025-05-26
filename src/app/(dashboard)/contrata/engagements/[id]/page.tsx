import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus } from "@prisma/client";
import Link from "next/link";
import MessageThread from "@/components/contrata/message-thread";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import {
  SERVICE_PACKAGE_NAMES,
  URGENCY_LEVEL_NAMES,
} from "@/lib/constants/service-packages";

export const metadata = {
  title: "Detalles del Contrato | CONTRATA | SIMPLE",
  description: "Ver detalles de tu contrato con especialista",
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

// Helper function to translate expertise areas to Spanish
function translateExpertiseArea(area: string): string {
  const translations: Record<string, string> = {
    NETWORK_SECURITY: "Seguridad de Redes",
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

  return translations[area] || area.replace(/_/g, " ");
}

export default async function EngagementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const engagementId = (await params).id;

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

  // Fetch engagement details
  const engagement = await prisma.engagement.findUnique({
    where: {
      id: engagementId,
      profileId: profile.id, // Ensure the engagement belongs to the user
    },
    include: {
      specialist: true,
      messages: {
        orderBy: {
          sentAt: "asc",
        },
      },
      attachments: true,
    },
  });

  if (!engagement) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/contrata/engagements"
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
        Volver a todos los contratos
      </Link>

      <div className="bg-card rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h1 className="text-2xl font-bold mb-2">{engagement.title}</h1>
              <div className="flex items-center mb-4">
                <span
                  className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusBadgeClass(engagement.status)}`}
                >
                  {translateStatus(engagement.status)}
                </span>
                <span className="text-muted-foreground text-sm ml-4">
                  Creado:{" "}
                  {format(new Date(engagement.createdAt), "d 'de' MMM, yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
            </div>

            {/* Status actions based on current status */}
            <div className="mt-4 md:mt-0">
              {engagement.status === "PENDING" && (
                <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition">
                  Cancelar Solicitud
                </button>
              )}
              {engagement.status === "ACCEPTED" && (
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-[hsl(var(--chart-2))] text-white rounded-md hover:bg-[hsl(var(--chart-2))/90] transition">
                    Realizar Pago
                  </button>
                  <button className="w-full px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition">
                    Cancelar
                  </button>
                </div>
              )}
              {engagement.status === "IN_PROGRESS" && (
                <button className="px-4 py-2 bg-[hsl(var(--chart-2))] text-white rounded-md hover:bg-[hsl(var(--chart-2))/90] transition">
                  Marcar como Completado
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row">
            <div className="md:w-2/3 md:pr-8">
              <h2 className="text-lg font-semibold mb-3">Descripción</h2>
              <p className="text-foreground whitespace-pre-line mb-6">
                {engagement.description}
              </p>

              {engagement.servicePackage && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Servicio Contratado
                  </h2>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">
                      {SERVICE_PACKAGE_NAMES[engagement.servicePackage] ||
                        engagement.servicePackage}
                    </h3>
                    {engagement.urgency && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Urgencia:{" "}
                        {URGENCY_LEVEL_NAMES[engagement.urgency] ||
                          engagement.urgency}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {engagement.attachments && engagement.attachments.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Archivos Adjuntos
                  </h2>
                  <div className="space-y-2">
                    {engagement.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-muted-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          <div>
                            <p className="font-medium text-sm">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(attachment.fileSize / 1024)} KB
                            </p>
                          </div>
                        </div>
                        <a
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                        >
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                {engagement.budget && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Presupuesto
                    </h3>
                    <p className="font-semibold">${engagement.budget}</p>
                  </div>
                )}
                {engagement.startDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Fecha de Inicio
                    </h3>
                    <p className="font-semibold">
                      {format(
                        new Date(engagement.startDate),
                        "d 'de' MMM, yyyy",
                        { locale: es }
                      )}
                    </p>
                  </div>
                )}
                {engagement.endDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Fecha de Finalización
                    </h3>
                    <p className="font-semibold">
                      {format(
                        new Date(engagement.endDate),
                        "d 'de' MMM, yyyy",
                        { locale: es }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Especialista</h2>
                <div className="flex items-center mb-4">
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
                      <span className="text-xl">👤</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">
                      {engagement.specialist.name}
                    </h3>
                    {engagement.specialist.location && (
                      <p className="text-sm text-muted-foreground">
                        {engagement.specialist.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {engagement.specialist.expertiseAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2 py-1 bg-accent text-accent-foreground text-xs rounded-full"
                    >
                      {translateExpertiseArea(area)}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {engagement.specialist.contactEmail}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/contrata/specialists/${engagement.specialist.id}`}
                    className="w-full px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition inline-block text-center"
                  >
                    Ver Perfil Completo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages section */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden p-6">
        <MessageThread engagementId={engagementId} profileId={profile.id} />
      </div>
    </div>
  );
}
