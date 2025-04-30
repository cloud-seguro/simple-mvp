import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { EngagementForm } from "@/components/contrata/engagement-form";
import Image from "next/image";

export const metadata = {
  title: "Contrata Especialista | CONTRATA | SIMPLE",
  description:
    "Contrata un especialista en ciberseguridad para tus necesidades de seguridad",
};

// Define the deal type to use for proper typing
type SpecialistDeal = {
  id: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
};

// Add dynamic export to handle the cookies usage
export const dynamic = "force-dynamic";

export default async function HireSpecialistPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ dealId?: string }>;
}) {
  const specialistId = (await params).id;
  const dealId = (await searchParams).dealId;

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
    select: {
      id: true,
      name: true,
      imageUrl: true,
      bio: true,
      expertiseAreas: true,
      location: true,
      contactEmail: true,
      deals: {
        where: {
          active: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          durationDays: true,
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

  // If dealId is provided, get that specific deal
  let selectedDeal: SpecialistDeal | null = null;
  if (dealId) {
    selectedDeal = specialist.deals.find((deal) => deal.id === dealId) || null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Contratar a {specialist.name}</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-center mb-6">
            {specialist.imageUrl ? (
              <Image
                src={specialist.imageUrl}
                alt={specialist.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center text-gray-500">
                <span className="text-xl">👤</span>
              </div>
            )}
            <div>
              <h2 className="text-lg font-medium">{specialist.name}</h2>
              {specialist.location && (
                <p className="text-sm text-gray-600">{specialist.location}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {specialist.expertiseAreas.map((area) => (
              <span
                key={area}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {translateExpertiseArea(area)}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-700 line-clamp-3">{specialist.bio}</p>
        </div>
      </div>

      <EngagementForm
        specialist={specialist}
        profileId={profile.id}
        selectedDeal={selectedDeal}
      />
    </div>
  );
}

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
