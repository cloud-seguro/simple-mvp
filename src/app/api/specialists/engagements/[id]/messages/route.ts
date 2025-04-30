import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// GET handler for retrieving messages
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
    // Get the user's profile to check if they're a SUPERADMIN
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        role: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
    });

    // Make sure the user is a SUPERADMIN
    if (!profile || profile.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { error: "Forbidden - Admin privileges required" },
        { status: 403 }
      );
    }

    // Verify the engagement exists
    const engagement = await prisma.engagement.findUnique({
      where: {
        id: engagementId,
      },
      select: {
        id: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      );
    }

    // Fetch messages for this engagement
    const messages = await prisma.message.findMany({
      where: {
        engagementId: engagementId,
      },
      orderBy: {
        sentAt: "asc",
      },
    });

    // Format the messages with additional user information
    const formattedMessages = messages.map((message) => {
      return {
        ...message,
        senderName: message.senderIsUser
          ? `${engagement.profile.firstName} ${engagement.profile.lastName}`
          : `${profile.firstName} ${profile.lastName} (Admin)`,
        senderAvatar: message.senderIsUser
          ? engagement.profile.avatarUrl
          : profile.avatarUrl,
      };
    });

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST handler for sending messages
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
    // Get the user's profile to check if they're a SUPERADMIN
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, role: true },
    });

    // Make sure the user is a SUPERADMIN
    if (!profile || profile.role !== UserRole.SUPERADMIN) {
      return NextResponse.json(
        { error: "Forbidden - Admin privileges required" },
        { status: 403 }
      );
    }

    // Verify the engagement exists
    const engagement = await prisma.engagement.findUnique({
      where: {
        id: engagementId,
      },
      select: {
        id: true,
      },
    });

    if (!engagement) {
      return NextResponse.json(
        { error: "Engagement not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const data = await request.json();

    if (!data.content) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Create a new message as admin (senderIsUser = false)
    const message = await prisma.message.create({
      data: {
        content: data.content,
        senderIsUser: false, // Message coming from admin, not user
        engagementId: engagementId,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
