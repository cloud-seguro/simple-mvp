import { NextRequest, NextResponse } from "next/server";
import {
  createEvaluation,
  canAccessAdvancedEvaluation,
} from "@/lib/evaluation-utils";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, answers } = body;

    // Validate required fields
    if (!type || !title || !answers) {
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

    // Get the user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("userId", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Check if user can access advanced evaluations
    if (type === "ADVANCED" && !canAccessAdvancedEvaluation(profile.role)) {
      return NextResponse.json(
        { error: "Premium subscription required for advanced evaluations" },
        { status: 403 }
      );
    }

    // Create the evaluation
    const evaluation = await createEvaluation({
      type,
      title,
      answers,
      profileId: profile.id,
      userRole: profile.role,
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

export async function GET(request: NextRequest) {
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
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("userId", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Only PREMIUM and SUPERADMIN users can access the dashboard
    if (profile.role !== "PREMIUM" && profile.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Premium subscription required to access evaluation history" },
        { status: 403 }
      );
    }

    // Get the user's evaluations
    const { data: evaluations } = await supabase
      .from("evaluations")
      .select("*")
      .eq("profileId", profile.id)
      .order("createdAt", { ascending: false });

    return NextResponse.json({ evaluations });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }
}
