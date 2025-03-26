import { type NextRequest, NextResponse } from "next/server";
import { createEvaluation } from "@/lib/evaluation-utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, answers, userId } = body;

    // Validate required fields
    if (!type || !title || !answers || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // All evaluations require authentication now
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the user's profile using Prisma
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if user can access advanced evaluations
    // Temporarily disabled premium requirement for advanced evaluations
    if (type === "ADVANCED") {
      // Always allow advanced evaluations for now
      console.log(
        "Premium check for advanced evaluations temporarily disabled"
      );
      // Original code:
      // if (!canAccessAdvancedEvaluation(userProfile.role)) {
      //   return NextResponse.json(
      //     { error: "Premium subscription required for advanced evaluations" },
      //     { status: 403 }
      //   );
      // }
    }

    // Create the evaluation
    const evaluation = await createEvaluation({
      type,
      title,
      answers,
      profileId: userProfile.id,
      userRole: userProfile.role,
    });

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error("Error saving evaluation:", error);
    return NextResponse.json(
      { error: "Failed to save evaluation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // This endpoint requires authentication
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the user's profile using Prisma
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Only PREMIUM and SUPERADMIN users can access the dashboard
    if (userProfile.role !== "PREMIUM" && userProfile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Premium subscription required to access evaluation history" },
        { status: 403 }
      );
    }

    // Get the user's evaluations using Prisma
    const evaluations = await prisma.evaluation.findMany({
      where: { profileId: userProfile.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }
}
