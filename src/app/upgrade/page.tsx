import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import PricingWrapper from "./pricing-wrapper";
import { UpgradeHeader } from "./upgrade-header";

// Define a type for the user profile
type UserProfile = {
  id: string;
  firstName: string | null;
  role: UserRole;
} | null;

export default async function UpgradePage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get the user's profile with retry logic
  let profile: UserProfile = null;
  let retryCount = 0;
  const maxRetries = 3;

  while (!profile && retryCount < maxRetries) {
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id },
        select: { id: true, role: true, firstName: true },
      });

      if (!profile) {
        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
        retryCount++;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      retryCount++;
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // If already a PREMIUM user, redirect to dashboard
  if (
    profile?.role === UserRole.PREMIUM ||
    profile?.role === UserRole.SUPERADMIN
  ) {
    redirect("/dashboard");
  }

  // If no profile after retries, create a basic profile
  if (!profile) {
    try {
      profile = await prisma.profile.upsert({
        where: { userId: user.id },
        update: {
          role: "FREE",
          active: true,
        },
        create: {
          userId: user.id,
          role: "FREE",
          active: true,
        },
        select: { id: true, role: true, firstName: true },
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      // Continue with the page even if profile creation fails
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Use the new UpgradeHeader component with logout button */}
      <UpgradeHeader />

      <main className="flex-grow">
        <PricingWrapper />
      </main>
    </div>
  );
}
