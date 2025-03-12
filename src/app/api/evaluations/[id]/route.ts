import { type NextRequest, NextResponse } from "next/server";
import { getEvaluationById } from "@/lib/evaluation-utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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

    // If the user is not authenticated, only return basic information
    if (!session?.user) {
      // For public access, only return non-sensitive data
      return NextResponse.json({
        evaluation: {
          id: evaluation.id,
          type: evaluation.type,
          title: evaluation.title,
          score: evaluation.score,
          createdAt: evaluation.createdAt,
          completedAt: evaluation.completedAt,
          answers: evaluation.answers,
          profile: {
            firstName: evaluation.profile.firstName || "Usuario",
            company: evaluation.profile.company || "Empresa",
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
      userProfile.id !== evaluation.profileId &&
      userProfile.role !== "SUPERADMIN"
    ) {
      return NextResponse.json({
        evaluation: {
          id: evaluation.id,
          type: evaluation.type,
          title: evaluation.title,
          score: evaluation.score,
          createdAt: evaluation.createdAt,
          completedAt: evaluation.completedAt,
          answers: evaluation.answers,
          profile: {
            firstName: evaluation.profile.firstName || "Usuario",
            company: evaluation.profile.company || "Empresa",
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
