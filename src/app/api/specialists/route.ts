import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// GET - List specialists (only accessible by SUPERADMIN)
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is SUPERADMIN
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, role: true },
  });

  if (!profile || profile.role !== UserRole.SUPERADMIN) {
    return NextResponse.json(
      { error: "Not authorized - SUPERADMIN role required" },
      { status: 403 }
    );
  }

  try {
    const specialists = await prisma.specialist.findMany({
      where: {
        createdById: profile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(specialists);
  } catch (error) {
    console.error("Error fetching specialists:", error);
    return NextResponse.json(
      { error: "Failed to fetch specialists" },
      { status: 500 }
    );
  }
}

// POST - Create a new specialist (only accessible by SUPERADMIN)
export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is SUPERADMIN
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true, role: true },
  });

  if (!profile || profile.role !== UserRole.SUPERADMIN) {
    return NextResponse.json(
      { error: "Not authorized - SUPERADMIN role required" },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();

    // Validate the createdById matches the profile ID
    if (data.createdById !== profile.id) {
      return NextResponse.json(
        { error: "Invalid createdById parameter" },
        { status: 400 }
      );
    }

    // Create the specialist
    const specialist = await prisma.specialist.create({
      data: {
        name: data.name,
        bio: data.bio,
        expertiseAreas: data.expertiseAreas,
        skills: data.skills || [],
        contactEmail: data.contactEmail,
        imageUrl: data.imageUrl || null,
        linkedinProfileUrl: data.linkedinProfileUrl || null,
        location: data.location || null,
        active: data.active !== undefined ? data.active : true,
        createdById: profile.id,
      },
    });

    return NextResponse.json(specialist, { status: 201 });
  } catch (error) {
    console.error("Error creating specialist:", error);
    return NextResponse.json(
      { error: "Failed to create specialist" },
      { status: 500 }
    );
  }
}
