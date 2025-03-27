import { type NextRequest, NextResponse } from "next/server";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface EvaluationData {
  id: string;
  type: string;
  title: string;
  score: number | null;
  createdAt: Date;
  completedAt: Date | null;
  answers: Record<string, unknown>;
  metadata: Record<string, unknown>;
  profile: {
    firstName: string | null;
    company: string | null;
    [key: string]: unknown;
  };
  profileId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Evaluation ID is required" },
        { status: 400 }
      );
    }

    // Get the evaluation
    const evaluation = await getEvaluationById(id);

    if (!evaluation) {
      return NextResponse.json(
        { error: "Evaluation not found" },
        { status: 404 }
      );
    }

    // Check if the user is authenticated
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Extract all evaluation data including metadata
    const {
      id: evalId,
      type,
      title,
      score,
      createdAt,
      completedAt,
      answers,
      metadata,
      profile,
      profileId,
    } = evaluation as EvaluationData;

    // If the user is not authenticated, only return basic information
    if (!session?.user) {
      // For public access, only return non-sensitive data
      return NextResponse.json({
        evaluation: {
          id: evalId,
          type,
          title,
          score,
          createdAt,
          completedAt,
          answers,
          metadata,
          profile: {
            firstName: profile.firstName || "Usuario",
            company: profile.company || "Empresa",
          },
        },
      });
    }

    // Get the user's profile
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("userId", session.user.id)
      .single();

    // If the user is authenticated but not the owner of the evaluation,
    // only return basic information unless they are a SUPERADMIN
    if (
      userProfile &&
      userProfile.id !== profileId &&
      userProfile.role !== "SUPERADMIN"
    ) {
      return NextResponse.json({
        evaluation: {
          id: evalId,
          type,
          title,
          score,
          createdAt,
          completedAt,
          answers,
          metadata,
          profile: {
            firstName: profile.firstName || "Usuario",
            company: profile.company || "Empresa",
          },
        },
      });
    }

    // If the user is the owner or a SUPERADMIN, return all information
    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 }
    );
  }
}
