import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// POST handler for creating a new message
export async function POST(
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

    // Verify that the engagement exists and belongs to the user
    const engagement = await prisma.engagement.findUnique({
      where: {
        id: engagementId,
        profileId: profile.id,
      },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found or access denied" },
        { status: 404 }
      );
    }

    // Parse the request body
    const data = await request.json();

    // Validate request data
    if (!data.content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Create a new message
    const message = await prisma.message.create({
      data: {
        content: data.content,
        senderIsUser: true, // Message is from the user
        engagementId: engagementId,
      },
    });

    // Return the created message
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

// GET handler for fetching messages
export async function GET(
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

    // Verify that the engagement exists and belongs to the user
    const engagement = await prisma.engagement.findUnique({
      where: {
        id: engagementId,
        profileId: profile.id,
      },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found or access denied" },
        { status: 404 }
      );
    }

    // Fetch the messages
    const messages = await prisma.message.findMany({
      where: {
        engagementId: engagementId,
      },
      orderBy: {
        sentAt: "asc",
      },
    });

    // Format dates properly for the frontend
    const formattedMessages = messages.map((message) => ({
      ...message,
      // Ensure sentAt is properly formatted as an ISO string
      sentAt: message.sentAt.toISOString(),
    }));

    // Return the messages
    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
