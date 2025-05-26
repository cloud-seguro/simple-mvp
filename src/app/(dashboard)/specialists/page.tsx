import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { SpecialistsClient } from "@/components/specialists/specialists-client";
import { UserRole, EngagementStatus } from "@prisma/client";
import Link from "next/link";
import {
  Bell,
  CircleCheck,
  CircleX,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";
import { STANDARD_PRICING } from "@/lib/constants/service-packages";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestión de Especialistas | SIMPLE",
  description:
    "Gestiona los especialistas en ciberseguridad para recomendaciones",
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

// Helper function to get icon based on status
const getStatusIcon = (status: EngagementStatus) => {
  switch (status) {
    case "PENDING":
      return Clock;
    case "ACCEPTED":
      return CircleCheck;
    case "REJECTED":
      return CircleX;
    case "IN_PROGRESS":
      return AlertCircle;
    case "COMPLETED":
      return CheckCircle2;
    case "CANCELLED":
      return XCircle;
    default:
      return Clock;
  }
};

// Translate status to Spanish
const translateStatus = (status: EngagementStatus): string => {
  switch (status) {
    case "PENDING":
      return "Pendientes";
    case "ACCEPTED":
      return "Aceptadas";
    case "IN_PROGRESS":
      return "En Progreso";
    case "COMPLETED":
      return "Completadas";
    case "REJECTED":
      return "Rechazadas";
    case "CANCELLED":
      return "Canceladas";
    default:
      return status;
  }
};

export default async function SpecialistsPage() {
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

  // Fetch all specialists created by this admin
  const specialists = await prisma.specialist.findMany({
    where: {
      createdById: profile.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Count engagements by status
  const engagementCounts = await prisma.engagement.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  // Create a map of status to count
  const countByStatus: Record<string, number> = {};
  engagementCounts.forEach((item) => {
    countByStatus[item.status] = item._count.status;
  });

  // Calculate total count
  const totalCount = Object.values(countByStatus).reduce(
    (acc, count) => acc + count,
    0
  );

  // Define the order of statuses to display
  const statusOrder: EngagementStatus[] = [
    "PENDING",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "REJECTED",
    "CANCELLED",
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Gestión de Especialistas en Ciberseguridad
        </h1>
        <Link
          href="/specialists/engagements"
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
        >
          <Bell className="w-4 h-4 mr-2" />
          Solicitudes{" "}
          {countByStatus["PENDING"] > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs">
              {countByStatus["PENDING"]}
            </span>
          )}
        </Link>
      </div>
      <p className="mb-6 text-gray-600">
        Administra especialistas que serán recomendados a los usuarios según sus
        resultados de evaluación.
      </p>

      {/* Status cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-4 border">
          <h2 className="text-lg font-medium mb-4">Estado de Solicitudes</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Total</span>
              <span className="font-bold">{totalCount}</span>
            </div>
            {statusOrder.map((status) => {
              const Icon = getStatusIcon(status);
              return (
                <Link
                  key={status}
                  href={`/specialists/engagements`}
                  className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    <span>{translateStatus(status)}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadgeClass(status)}`}
                  >
                    {countByStatus[status] || 0}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pricing Overview Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 border md:col-span-2">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
            <h2 className="text-lg font-medium">
              Precios Estándar de Servicios
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(STANDARD_PRICING).map(([key, service]) => (
              <div
                key={key}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="text-sm font-medium">{service.description}</p>
                  <p className="text-xs text-gray-500">{service.duration}</p>
                </div>
                <span className="text-sm font-bold text-green-600">
                  ${service.price}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Precios uniformes aplicados a todos los especialistas
          </p>
        </div>
      </div>

      <SpecialistsClient
        initialSpecialists={specialists}
        profileId={profile.id}
      />
    </div>
  );
}
