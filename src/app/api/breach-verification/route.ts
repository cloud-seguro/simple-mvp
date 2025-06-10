import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  BreachSearchType,
  BreachRequestStatus,
  RiskLevel,
  BreachSeverity,
  PasswordStrength,
} from "@prisma/client";
import { validateEmail, validateDomain } from "@/lib/utils/breach-verification";

const searchRequestSchema = z.object({
  type: z.enum(["EMAIL", "DOMAIN"]),
  searchValue: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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

    const body = await request.json();
    const validatedData = searchRequestSchema.parse(body);

    // Validate search value based on type
    if (
      validatedData.type === "EMAIL" &&
      !validateEmail(validatedData.searchValue)
    ) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (
      validatedData.type === "DOMAIN" &&
      !validateDomain(validatedData.searchValue)
    ) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check if Prisma client has the breach models
    if (!prisma.breachSearchRequest) {
      console.error("Prisma breachSearchRequest model not found");
      return NextResponse.json(
        {
          error:
            "Database models not available. Please check server configuration.",
        },
        { status: 500 }
      );
    }

    // Create breach search request
    const searchRequest = await prisma.breachSearchRequest.create({
      data: {
        type: validatedData.type as BreachSearchType,
        searchValue: validatedData.searchValue,
        profileId: profile.id,
        status: BreachRequestStatus.PROCESSING,
      },
    });

    // Simulate breach search (replace with actual breach API integration)
    const mockResults = await simulateBreachSearch(
      searchRequest.id,
      validatedData.type as BreachSearchType,
      validatedData.searchValue
    );

    // Update search request with results
    const updatedRequest = await prisma.breachSearchRequest.update({
      where: { id: searchRequest.id },
      data: {
        status: BreachRequestStatus.COMPLETED,
        completedAt: new Date(),
        totalBreaches: mockResults.breachCount,
        riskLevel: mockResults.riskLevel,
      },
      include: {
        results: true,
        passwordAnalysis: true,
      },
    });

    // Create search history entry
    await prisma.breachSearchHistory.create({
      data: {
        requestId: searchRequest.id,
        profileId: profile.id,
        searchType: validatedData.type as BreachSearchType,
        searchValue: validatedData.searchValue,
        breachCount: mockResults.breachCount,
        riskLevel: mockResults.riskLevel,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        requestId: updatedRequest.id,
        breachCount: updatedRequest.totalBreaches,
        riskLevel: updatedRequest.riskLevel,
        results: updatedRequest.results,
        passwordAnalysis: updatedRequest.passwordAnalysis,
      },
    });
  } catch (error) {
    console.error("Breach verification error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

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

    // Check if Prisma client has the breach models
    if (!prisma.breachSearchHistory) {
      console.error("Prisma breachSearchHistory model not found");
      return NextResponse.json(
        {
          error:
            "Database models not available. Please check server configuration.",
        },
        { status: 500 }
      );
    }

    // Get search history
    const searchHistory = await prisma.breachSearchHistory.findMany({
      where: { profileId: profile.id },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: searchHistory,
    });
  } catch (error) {
    console.error("Get search history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mock breach search function (replace with actual breach API integration)
async function simulateBreachSearch(
  requestId: string,
  type: BreachSearchType,
  searchValue: string
) {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate mock data based on search value
  const breachCount = Math.floor(Math.random() * 5) + 1;
  const riskLevel =
    breachCount >= 3
      ? RiskLevel.HIGH
      : breachCount >= 2
        ? RiskLevel.MEDIUM
        : RiskLevel.LOW;

  // Create mock breach results
  const mockBreaches = Array.from({ length: breachCount }, (_, index) => ({
    requestId,
    breachName: `Data Breach ${index + 1}`,
    breachDate: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5
    ), // Random date in last 5 years
    affectedEmails: type === "EMAIL" ? [searchValue] : [],
    affectedDomains: type === "DOMAIN" ? [searchValue] : [],
    dataTypes: ["emails", "passwords", "names"],
    severity: BreachSeverity.MEDIUM,
    description: `Breach affecting ${type === "EMAIL" ? "email" : "domain"}: ${searchValue}`,
    isVerified: true,
  }));

  // Create breach results in database
  await prisma.breachResult.createMany({
    data: mockBreaches,
  });

  // Create mock password analysis if passwords were found
  if (Math.random() > 0.5) {
    const mockPasswords = [
      {
        requestId,
        passwordHash: "hashed_password_1",
        strength: PasswordStrength.WEAK,
        occurrences: 2,
        recommendation: "Cambiar inmediatamente",
        crackTime: "Instantly",
        patterns: ["common_word", "sequential_numbers"],
        entropy: 25.5,
      },
      {
        requestId,
        passwordHash: "hashed_password_2",
        strength: PasswordStrength.MEDIUM,
        occurrences: 1,
        recommendation: "Considerar cambio",
        crackTime: "1 day",
        patterns: ["mixed_case"],
        entropy: 45.2,
      },
    ];

    await prisma.passwordAnalysis.createMany({
      data: mockPasswords,
    });
  }

  return {
    breachCount,
    riskLevel,
  };
}
