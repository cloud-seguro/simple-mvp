import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { SpecialistsClient } from "@/components/specialists/specialists-client";
import { UserRole } from "@prisma/client";

export const metadata = {
  title: "Gestión de Especialistas | SIMPLE",
  description:
    "Gestiona los especialistas en ciberseguridad para recomendaciones",
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Cybersecurity Specialists Management
      </h1>
      <p className="mb-6 text-gray-600">
        Manage specialists who will be recommended to users based on their
        evaluation results.
      </p>

      <SpecialistsClient
        initialSpecialists={specialists}
        profileId={profile.id}
      />
    </div>
  );
}
