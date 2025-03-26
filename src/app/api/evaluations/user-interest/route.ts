import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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

    // Get the user's profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get the user's most recent evaluation with interest data
    const evaluationWithInterest = await prisma.evaluation.findFirst({
      where: {
        profileId: userProfile.id,
        metadata: {
          path: ["interest"],
          not: null,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // If no previous interest data is found, return hasInterestData: false
    if (!evaluationWithInterest || !evaluationWithInterest.metadata) {
      return NextResponse.json({
        hasInterestData: false,
      });
    }

    // Extract the interest data from the evaluation metadata
    const metadata = evaluationWithInterest.metadata as any;
    const interest = metadata.interest;

    // Return the interest data
    return NextResponse.json({
      hasInterestData: true,
      interest,
    });
  } catch (error) {
    console.error("Error fetching user interest data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user interest data" },
      { status: 500 }
    );
  }
}
