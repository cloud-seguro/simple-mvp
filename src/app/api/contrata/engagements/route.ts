import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus, Prisma } from "@prisma/client";
import {
  SERVICE_PACKAGE_IDS,
  SERVICE_PACKAGE_NAMES,
  URGENCY_LEVEL_IDS,
  URGENCY_LEVEL_NAMES,
} from "@/lib/constants/service-packages";

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

    // Validate service package if provided
    if (
      data.servicePackage &&
      !SERVICE_PACKAGE_IDS.includes(data.servicePackage)
    ) {
      return NextResponse.json(
        { error: "Invalid service package" },
        { status: 400 }
      );
    }

    // Validate urgency level if provided
    if (data.urgency && !URGENCY_LEVEL_IDS.includes(data.urgency)) {
      return NextResponse.json(
        { error: "Invalid urgency level" },
        { status: 400 }
      );
    }

    // Create engagement data
    const engagementData: Prisma.EngagementCreateInput = {
      title: data.title,
      description: data.description,
      budget: data.budget ? parseFloat(data.budget) : null,
      profile: {
        connect: { id: profile.id },
      },
      specialist: {
        connect: { id: data.specialistId },
      },
    };

    // Add optional fields if provided
    if (data.startDate) {
      engagementData.startDate = new Date(data.startDate);
    }

    // Calculate end date if timeframe is provided
    if (data.timeframe) {
      const timeframeDays = parseInt(data.timeframe);
      if (!isNaN(timeframeDays) && timeframeDays > 0) {
        const startDate = data.startDate
          ? new Date(data.startDate)
          : new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + timeframeDays);
        engagementData.endDate = endDate;
      }
    }

    // Create the engagement
    const engagement = await prisma.engagement.create({
      data: engagementData,
      include: {
        specialist: {
          select: {
            id: true,
            name: true,
            contactEmail: true,
          },
        },
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create initial system message with engagement details
    let systemMessage = `Nueva solicitud de contratación creada.\n\n`;
    systemMessage += `**Detalles del proyecto:**\n`;
    systemMessage += `- Título: ${data.title}\n`;
    systemMessage += `- Descripción: ${data.description}\n`;

    if (data.budget) {
      systemMessage += `- Presupuesto: $${data.budget}\n`;
    }

    if (data.timeframe) {
      systemMessage += `- Plazo: ${data.timeframe} días\n`;
    }

    if (data.servicePackage && data.servicePackage !== "custom") {
      const packageName = SERVICE_PACKAGE_NAMES[data.servicePackage];
      if (packageName) {
        systemMessage += `- Paquete de servicio: ${packageName}\n`;
      }
    }

    if (data.urgency) {
      const urgencyName = URGENCY_LEVEL_NAMES[data.urgency];
      if (urgencyName) {
        systemMessage += `- Urgencia: ${urgencyName}\n`;
      }
    }

    systemMessage += `\nEl especialista revisará tu solicitud y se pondrá en contacto contigo pronto.`;

    // Create the initial system message
    await prisma.message.create({
      data: {
        content: systemMessage,
        senderIsUser: false,
        engagementId: engagement.id,
      },
    });

    // Handle attachments if provided
    if (
      data.attachments &&
      Array.isArray(data.attachments) &&
      data.attachments.length > 0
    ) {
      try {
        const attachmentPromises = data.attachments.map(
          (attachment: {
            fileName: string;
            fileUrl: string;
            fileType: string;
            fileSize: number;
          }) =>
            prisma.attachment.create({
              data: {
                fileName: attachment.fileName,
                fileUrl: attachment.fileUrl,
                fileType: attachment.fileType,
                fileSize: attachment.fileSize,
                engagementId: engagement.id,
              },
            })
        );

        await Promise.all(attachmentPromises);

        // Create a message about the attachments
        await prisma.message.create({
          data: {
            content: `Se han adjuntado ${data.attachments.length} archivo(s) a esta solicitud.`,
            senderIsUser: true,
            engagementId: engagement.id,
          },
        });
      } catch (attachmentError) {
        console.error("Error creating attachments:", attachmentError);
        // Don't fail the entire request if attachments fail
      }
    }

    // TODO: Send notification email to specialist
    // This would be implemented with your email service (Resend, etc.)

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

    // Check if the user is authorized
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as EngagementStatus | null;
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

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
