import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { Suspense } from "react";

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
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
    select: { role: true },
  });

  // If no profile or not a premium/superadmin user, redirect to upgrade page
  if (
    !profile ||
    (profile.role !== UserRole.PREMIUM && profile.role !== UserRole.SUPERADMIN)
  ) {
    redirect("/upgrade");
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<SecurityLoadingScreen message="Cargando dashboard..." />}
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
