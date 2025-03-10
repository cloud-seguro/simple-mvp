import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // This would normally integrate with a payment processor like Stripe
    // For now, we'll just upgrade the user directly

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        )
      );
    }

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        )
      );
    }

    // Upgrade the user to PREMIUM
    await prisma.profile.update({
      where: { id: profile.id },
      data: { role: "PREMIUM" },
    });

    // Redirect to the dashboard
    return NextResponse.redirect(
      new URL(
        "/dashboard",
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      )
    );
  } catch (error) {
    console.error("Error upgrading user:", error);
    return NextResponse.redirect(
      new URL(
        "/upgrade?error=true",
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      )
    );
  }
}
