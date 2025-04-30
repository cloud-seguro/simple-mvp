import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus, Prisma } from "@prisma/client";

// POST handler for creating a new engagement
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Verify authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, role: true },
    });

    // Check if the user is authorized (PREMIUM or SUPERADMIN)
    if (
      !profile ||
      (profile.role !== UserRole.PREMIUM &&
        profile.role !== UserRole.SUPERADMIN)
    ) {
      return NextResponse.json(
        { error: "Forbidden - Premium subscription required" },
        { status: 403 }
      );
    }

    // Parse the request body
    const data = await request.json();

    // Validate request data
    if (!data.title || !data.description || !data.specialistId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Make sure the profile ID in the request matches the authenticated user's profile
    if (data.profileId !== profile.id) {
      return NextResponse.json(
        { error: "Invalid profile ID" },
        { status: 400 }
      );
    }

    // Verify that the specialist exists and is active
    const specialist = await prisma.specialist.findUnique({
      where: {
        id: data.specialistId,
        active: true,
      },
    });

    if (!specialist) {
      return NextResponse.json(
        { error: "Specialist not found or inactive" },
        { status: 404 }
      );
    }

    // If deal ID is provided, verify it belongs to the specialist
    if (data.dealId) {
      const deal = await prisma.specialistDeal.findUnique({
        where: {
          id: data.dealId,
          specialistId: data.specialistId,
          active: true,
        },
      });

      if (!deal) {
        return NextResponse.json(
          { error: "Invalid deal selected" },
          { status: 400 }
        );
      }
    }

    // Create a new engagement first
    const engagement = await prisma.engagement.create({
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        startDate: data.startDate,
        profileId: profile.id,
        specialistId: data.specialistId,
        dealId: data.dealId,
      },
    });

    // Note on attachments: We'll handle attachment creation in a separate API endpoint
    // to avoid issues with the current Prisma client typing
    if (
      data.attachments &&
      Array.isArray(data.attachments) &&
      data.attachments.length > 0
    ) {
      // Log that we received attachments but aren't handling them yet
      console.log(
        `Received ${data.attachments.length} attachments for engagement ${engagement.id}`
      );
    }

    // Return the created engagement
    return NextResponse.json(engagement, { status: 201 });
  } catch (error) {
    console.error("Error creating engagement:", error);
    return NextResponse.json(
      { error: "Failed to create engagement" },
      { status: 500 }
    );
  }
}

// GET handler for fetching engagements
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // Verify authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, role: true },
    });

    // Check if the user is authorized (PREMIUM or SUPERADMIN)
    if (
      !profile ||
      (profile.role !== UserRole.PREMIUM &&
        profile.role !== UserRole.SUPERADMIN)
    ) {
      return NextResponse.json(
        { error: "Forbidden - Premium subscription required" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const status = url.searchParams.get("status") as EngagementStatus | null;

    // Build the query
    const query: {
      where: {
        profileId: string;
        status?: EngagementStatus;
      };
      include: {
        specialist: {
          select: {
            id: boolean;
            name: boolean;
            imageUrl: boolean;
          };
        };
        deal: {
          select: {
            id: boolean;
            title: boolean;
            price: boolean;
          };
        };
      };
      orderBy: {
        createdAt: Prisma.SortOrder;
      };
      skip: number;
      take: number;
    } = {
      where: {
        profileId: profile.id,
      },
      include: {
        specialist: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        deal: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    };

    // Add status filter if provided
    if (status) {
      query.where.status = status;
    }

    // Count total engagements
    const totalCount = await prisma.engagement.count({
      where: query.where,
    });

    // Fetch engagements
    const engagements = await prisma.engagement.findMany(query);

    // Return engagements with pagination info
    return NextResponse.json({
      engagements,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Error fetching engagements:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagements" },
      { status: 500 }
    );
  }
}
