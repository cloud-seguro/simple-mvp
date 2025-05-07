import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { Suspense } from "react";
import { RedirectToUpgrade } from "@/components/redirect-to-upgrade";

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // For server components, we can only pass cookies as parameter
    const supabase = createServerComponentClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Instead of redirecting server-side, return a client component that will redirect
      return <RedirectToUpgrade path="/sign-in" />;
    }

    // Get the user's profile to check their role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { role: true },
    });

    // If no profile or not a premium/superadmin user, use client-side redirect
    if (
      !profile ||
      (profile.role !== UserRole.PREMIUM &&
        profile.role !== UserRole.SUPERADMIN)
    ) {
      // Return client component that will handle the redirect
      return <RedirectToUpgrade path="/upgrade" />;
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
  } catch (error) {
    console.error("Error in dashboard layout:", error);
    // Return client component that will handle the redirect on error
    return <RedirectToUpgrade path="/sign-in" />;
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
