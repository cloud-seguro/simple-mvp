import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface RouteParams {
  params: Promise<{
    requestId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { requestId } = await params;
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({
      cookies: () => Promise.resolve(cookieStore),
    });

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch the breach search request with all related data
    const breachRequest = await prisma.breachSearchRequest.findFirst({
      where: {
        id: requestId,
        profileId: profile.id, // Ensure user can only access their own requests
      },
      include: {
        results: {
          orderBy: {
            breachDate: "desc",
          },
        },
        passwordAnalysis: {
          orderBy: {
            strength: "asc",
          },
        },
      },
    });

    if (!breachRequest) {
      return NextResponse.json(
        { error: "Breach request not found or access denied" },
        { status: 404 }
      );
    }

    // Format the response data
    const responseData = {
      ...breachRequest,
      results:
        breachRequest.results?.map((result) => ({
          id: result.id,
          requestId: result.requestId,
          sourceId: result.sourceId,
          breachName: result.breachName,
          breachDate: result.breachDate,
          affectedEmails: result.affectedEmails,
          affectedDomains: result.affectedDomains,
          dataTypes: result.dataTypes,
          severity: result.severity,
          description: result.description,
          verificationDate: result.verificationDate,
          isVerified: result.isVerified,
          metadata: result.metadata,
        })) || [],
      passwordAnalysis:
        breachRequest.passwordAnalysis?.map((analysis) => ({
          id: analysis.id,
          requestId: analysis.requestId,
          passwordHash: analysis.passwordHash,
          strength: analysis.strength,
          occurrences: analysis.occurrences,
          recommendation: analysis.recommendation,
          crackTime: analysis.crackTime,
          patterns: analysis.patterns,
          entropy: analysis.entropy,
          createdAt: analysis.createdAt,
        })) || [],
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching breach details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
