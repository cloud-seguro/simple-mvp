import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { MessageThread } from "@/components/message-thread";
import { UpdateEngagementForm } from "@/components/specialists/update-engagement-form";
import {
  SERVICE_PACKAGES,
  SERVICE_PACKAGE_NAMES,
  URGENCY_LEVELS,
  URGENCY_LEVEL_NAMES,
} from "@/lib/constants/service-packages";

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Detalle de Solicitud | SIMPLE",
  description: "Detalles de solicitud de contratación de especialista",
};

// Helper function to get badge color based on status
const getStatusBadgeClass = (status: EngagementStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "ACCEPTED":
      return "bg-blue-100 text-blue-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "IN_PROGRESS":
      return "bg-green-100 text-green-800";
    case "COMPLETED":
      return "bg-purple-100 text-purple-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: EngagementStatus) => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "ACCEPTED":
      return "Aceptada";
    case "REJECTED":
      return "Rechazada";
    case "IN_PROGRESS":
      return "En Progreso";
    case "COMPLETED":
      return "Completada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
};

export default async function SpecialistEngagementDetailPage({
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

  // If not a SUPERADMIN, redirect to dashboard
  if (!profile || profile.role !== UserRole.SUPERADMIN) {
    redirect("/dashboard");
  }

  // Fetch engagement details
  const engagement = await prisma.engagement.findUnique({
    where: {
      id: engagementId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      budget: true,
      startDate: true,
      endDate: true,
      createdAt: true,
      servicePackage: true,
      urgency: true,
      specialist: {
        select: {
          id: true,
          name: true,
          bio: true,
          expertiseAreas: true,
          imageUrl: true,
          contactEmail: true,
          location: true,
          linkedinProfileUrl: true,
          skills: true,
        },
      },
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
          company: true,
          company_role: true,
          phoneNumber: true,
        },
      },
    },
  });

  if (!engagement) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Link
        href="/specialists/engagements"
        className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Volver a todas las solicitudes
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
                  {getStatusText(engagement.status)}
                </span>
                <span className="text-muted-foreground text-sm ml-4">
                  Creada: {format(new Date(engagement.createdAt), "dd/MM/yyyy")}
                </span>
              </div>
            </div>

            {/* Specialist admin actions */}
            <div className="mt-4 md:mt-0">
              <UpdateEngagementForm
                engagementId={engagement.id}
                currentStatus={engagement.status}
              />
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
                    Servicio Seleccionado
                  </h2>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">
                      {SERVICE_PACKAGE_NAMES[engagement.servicePackage] ||
                        engagement.servicePackage}
                    </h3>
                    {SERVICE_PACKAGES[
                      engagement.servicePackage as keyof typeof SERVICE_PACKAGES
                    ] && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Precio: $
                          {
                            SERVICE_PACKAGES[
                              engagement.servicePackage as keyof typeof SERVICE_PACKAGES
                            ].price
                          }{" "}
                          • Duración:{" "}
                          {
                            SERVICE_PACKAGES[
                              engagement.servicePackage as keyof typeof SERVICE_PACKAGES
                            ].duration
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            SERVICE_PACKAGES[
                              engagement.servicePackage as keyof typeof SERVICE_PACKAGES
                            ].description
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {engagement.urgency && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Nivel de Urgencia
                  </h2>
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          engagement.urgency === "HIGH"
                            ? "bg-red-500"
                            : engagement.urgency === "MEDIUM"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      ></div>
                      <span className="font-medium">
                        {URGENCY_LEVEL_NAMES[engagement.urgency] ||
                          engagement.urgency}
                      </span>
                    </div>
                    {URGENCY_LEVELS[
                      engagement.urgency as keyof typeof URGENCY_LEVELS
                    ] && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {
                          URGENCY_LEVELS[
                            engagement.urgency as keyof typeof URGENCY_LEVELS
                          ].description
                        }
                      </p>
                    )}
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
                      {format(new Date(engagement.startDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                )}
                {engagement.endDate && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Fecha de Fin
                    </h3>
                    <p className="font-semibold">
                      {format(new Date(engagement.endDate), "dd/MM/yyyy")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/3 mt-6 md:mt-0 space-y-6">
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-3">Cliente</h2>
                <div className="flex items-center mb-4">
                  {engagement.profile.avatarUrl ? (
                    <Image
                      src={engagement.profile.avatarUrl}
                      alt={`${engagement.profile.firstName} ${engagement.profile.lastName}`}
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
                      {engagement.profile.firstName}{" "}
                      {engagement.profile.lastName}
                    </h3>
                    {engagement.profile.company && (
                      <p className="text-sm text-muted-foreground">
                        {engagement.profile.company}{" "}
                        {engagement.profile.company_role &&
                          `• ${engagement.profile.company_role}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-muted-foreground"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{engagement.profile.email}</span>
                  </p>
                  {engagement.profile.phoneNumber && (
                    <p className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-muted-foreground"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{engagement.profile.phoneNumber}</span>
                    </p>
                  )}
                </div>
              </div>

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
                      {area.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-muted-foreground"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>{engagement.specialist.contactEmail}</span>
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/specialists`}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Ver todos los especialistas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Thread Component */}
      <div className="bg-card rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Mensajes</h2>
          <MessageThread
            engagementId={engagement.id}
            profileId={profile.id}
            adminMode={true}
          />
        </div>
      </div>
    </div>
  );
}
