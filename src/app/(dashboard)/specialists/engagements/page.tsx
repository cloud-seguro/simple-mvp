import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Solicitudes de Contratación | SIMPLE",
  description:
    "Gestiona todas las solicitudes de contratación de especialistas",
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

export default async function SpecialistsEngagementsPage() {
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

  // Fetch all engagements
  const engagements = await prisma.engagement.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      budget: true,
      startDate: true,
      createdAt: true,
      profile: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatarUrl: true,
        },
      },
      specialist: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          expertiseAreas: true,
        },
      },
      deal: {
        select: {
          id: true,
          title: true,
          price: true,
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
    "PENDING",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link href="/specialists" className="mr-4">
          <ArrowLeft className="h-5 w-5 text-primary" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Solicitudes de Contratación
          </h1>
          <p className="text-muted-foreground">
            Administra todas las solicitudes de contratación de especialistas
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm p-6">
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
            <h3 className="mt-4 text-lg font-medium">No hay solicitudes aún</h3>
            <p className="mt-1 text-muted-foreground">
              No hay solicitudes de contratación en el sistema.
            </p>
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
                    {status === "PENDING" && "Pendientes"}
                    {status === "ACCEPTED" && "Aceptadas"}
                    {status === "IN_PROGRESS" && "En Progreso"}
                    {status === "COMPLETED" && "Completadas"}
                    {status === "REJECTED" && "Rechazadas"}
                    {status === "CANCELLED" && "Canceladas"} (
                    {groupedEngagements[status].length})
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {groupedEngagements[status].map((engagement) => (
                      <Link
                        key={engagement.id}
                        href={`/specialists/engagements/${engagement.id}`}
                        className="border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex items-center mb-4 md:mb-0">
                            <div className="flex-shrink-0 mr-4">
                              {engagement.specialist.imageUrl ? (
                                <Image
                                  src={engagement.specialist.imageUrl}
                                  alt={engagement.specialist.name}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                                  <span className="text-lg">👤</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {engagement.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Especialista: {engagement.specialist.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Cliente: {engagement.profile.firstName}{" "}
                                {engagement.profile.lastName}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1 md:text-right">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(engagement.status)}`}
                            >
                              {status === "PENDING" && "Pendiente"}
                              {status === "ACCEPTED" && "Aceptada"}
                              {status === "IN_PROGRESS" && "En Progreso"}
                              {status === "COMPLETED" && "Completada"}
                              {status === "REJECTED" && "Rechazada"}
                              {status === "CANCELLED" && "Cancelada"}
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Creada:{" "}
                              {format(
                                new Date(engagement.createdAt),
                                "dd/MM/yyyy"
                              )}
                            </p>
                            {engagement.budget && (
                              <p className="text-sm font-medium">
                                Presupuesto: ${engagement.budget}
                              </p>
                            )}
                          </div>
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
