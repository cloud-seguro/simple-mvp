import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ExpertiseArea } from "@prisma/client";

// GET - Get recommended specialists based on maturity level
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const maturityLevel = parseInt(searchParams.get("level") || "1", 10);
  const categoriesParam = searchParams.get("categories");

  // Parse categories, ensuring they are valid ExpertiseArea values
  let expertiseCategories: ExpertiseArea[] = [];
  if (categoriesParam) {
    const rawCategories = categoriesParam.split(",").filter(Boolean);
    // Filter only valid categories that exist in ExpertiseArea enum
    expertiseCategories = rawCategories
      .filter(
        (cat) =>
          Object.values(ExpertiseArea).includes(cat as ExpertiseArea) ||
          Object.values(ExpertiseArea).includes(
            cat.toUpperCase() as ExpertiseArea
          )
      )
      .map((cat) => cat as ExpertiseArea); // Explicit type cast
  }

  console.log(`API: Fetching specialists for maturity level ${maturityLevel}`);
  console.log(
    `API: Categories filter: ${expertiseCategories.length > 0 ? expertiseCategories.join(", ") : "none"}`
  );

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("API: Unauthorized - no session");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // For testing, first check if any specialists exist
    const allSpecialists = await prisma.specialist.findMany({
      take: 5,
    });

    console.log(`API: Total specialists in database: ${allSpecialists.length}`);

    // Query conditions - Removed minMaturityLevel and maxMaturityLevel
    const whereCondition = {
      active: true,
      ...(expertiseCategories.length > 0
        ? {
            expertiseAreas: {
              hasSome: expertiseCategories,
            },
          }
        : {}),
    };

    console.log(`API: Query where condition:`, JSON.stringify(whereCondition));

    // Find specialists matching criteria
    const specialists = await prisma.specialist.findMany({
      where: whereCondition,
      orderBy: {
        createdAt: "desc",
      },
      // Limit to 5 specialists
      take: 5,
    });

    console.log(`API: Found ${specialists.length} matching specialists`);

    // If no specialists match the specific criteria, return all active specialists
    if (specialists.length === 0 && allSpecialists.length > 0) {
      console.log(
        "API: No specialists match criteria, returning all active ones"
      );
      const fallbackSpecialists = await prisma.specialist.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      return NextResponse.json(fallbackSpecialists);
    }

    return NextResponse.json(specialists);
  } catch (error) {
    console.error("Error fetching recommended specialists:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommended specialists" },
      { status: 500 }
    );
  }
}
