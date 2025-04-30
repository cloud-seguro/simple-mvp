import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole, EngagementStatus } from "@prisma/client";

// Helper function to translate status to Spanish
const translateStatus = (status: EngagementStatus): string => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "ACCEPTED":
      return "Aceptada";
    case "REJECTED":
      return "Rechazada";
    case "IN_PROGRESS":
      return "En Progreso";
    case "COMPLETED":
      return "Completada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
};

// PATCH handler for updating engagement status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const engagementId = (await params).id;
  const supabase = createRouteHandlerClient({ cookies });

  // Verify authentication
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get the user's profile to check if they're a SUPERADMIN
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, role: true, firstName: true, lastName: true },
    });

    // Make sure the user is a SUPERADMIN
    if (!profile || profile.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { error: "Forbidden - Admin privileges required" },
        { status: 403 }
      );
    }

    // Parse request body
    const data = await request.json();

    if (!data.status) {
      return NextResponse.json(
        { error: "Status field is required" },
        { status: 400 }
      );
    }

    // If status is REJECTED or CANCELLED, reason is required
    if (
      (data.status === "REJECTED" || data.status === "CANCELLED") &&
      !data.reason
    ) {
      return NextResponse.json(
        { error: "Reason is required when rejecting or cancelling" },
        { status: 400 }
      );
    }

    // Don't allow returning to PENDING from other statuses
    if (
      data.status === "PENDING" &&
      (data.previousStatus === "ACCEPTED" ||
        data.previousStatus === "IN_PROGRESS" ||
        data.previousStatus === "COMPLETED" ||
        data.previousStatus === "REJECTED" ||
        data.previousStatus === "CANCELLED")
    ) {
      return NextResponse.json(
        { error: "Cannot return to PENDING status once approved or rejected" },
        { status: 400 }
      );
    }

    // Make sure previous status is provided for tracking history
    const previousStatus = data.previousStatus || "PENDING";

    // Create a status update message based on the type of update
    let statusMessage = `Estado actualizado de "${translateStatus(previousStatus as EngagementStatus)}" a "${translateStatus(data.status as EngagementStatus)}"`;

    // Add reason if provided
    if (data.reason) {
      statusMessage += `\n\nRazón: ${data.reason}`;
    }

    // Use a transaction to update engagement, record history, and create a status message
    const [updatedEngagement, statusChange, message] =
      await prisma.$transaction([
        // Update the engagement
        prisma.engagement.update({
          where: {
            id: engagementId,
          },
          data: {
            status: data.status as EngagementStatus,
          },
        }),

        // Record the status change in history
        prisma.statusChange.create({
          data: {
            previousStatus: previousStatus as EngagementStatus,
            newStatus: data.status as EngagementStatus,
            reason: data.reason,
            engagementId: engagementId,
          },
        }),

        // Create a system message to show the status change in the conversation
        prisma.message.create({
          data: {
            content: statusMessage,
            senderIsUser: false, // System message appears as from admin
            engagementId: engagementId,
          },
        }),
      ]);

    return NextResponse.json({
      engagement: updatedEngagement,
      statusChange,
      message,
    });
  } catch (error) {
    console.error("Error updating engagement:", error);
    return NextResponse.json(
      { error: "Failed to update engagement" },
      { status: 500 }
    );
  }
}
