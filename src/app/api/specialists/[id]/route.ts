import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

// GET - Get a specific specialist
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const specialist = await prisma.specialist.findUnique({
      where: { id },
    });

    if (!specialist) {
      return NextResponse.json(
        { error: "Specialist not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(specialist);
  } catch (error) {
    console.error("Error fetching specialist:", error);
    return NextResponse.json(
      { error: "Failed to fetch specialist" },
      { status: 500 }
    );
  }
}

// PATCH - Update a specialist (only accessible by the SUPERADMIN who created it)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
    // Check if the specialist exists and belongs to this admin
    const existingSpecialist = await prisma.specialist.findUnique({
      where: { id },
    });

    if (!existingSpecialist) {
      return NextResponse.json(
        { error: "Specialist not found" },
        { status: 404 }
      );
    }

    if (existingSpecialist.createdById !== profile.id) {
      return NextResponse.json(
        { error: "You are not authorized to update this specialist" },
        { status: 403 }
      );
    }

    const data = await req.json();

    // Update the specialist
    const updatedSpecialist = await prisma.specialist.update({
      where: { id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        bio: data.bio !== undefined ? data.bio : undefined,
        expertiseAreas:
          data.expertiseAreas !== undefined ? data.expertiseAreas : undefined,
        contactEmail:
          data.contactEmail !== undefined ? data.contactEmail : undefined,
        contactPhone:
          data.contactPhone !== undefined ? data.contactPhone : undefined,
        website: data.website !== undefined ? data.website : undefined,
        imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
        minMaturityLevel:
          data.minMaturityLevel !== undefined
            ? data.minMaturityLevel
            : undefined,
        maxMaturityLevel:
          data.maxMaturityLevel !== undefined
            ? data.maxMaturityLevel
            : undefined,
        location: data.location !== undefined ? data.location : undefined,
        active: data.active !== undefined ? data.active : undefined,
      },
    });

    return NextResponse.json(updatedSpecialist);
  } catch (error) {
    console.error("Error updating specialist:", error);
    return NextResponse.json(
      { error: "Failed to update specialist" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specialist (only accessible by the SUPERADMIN who created it)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
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
    // Check if the specialist exists and belongs to this admin
    const existingSpecialist = await prisma.specialist.findUnique({
      where: { id },
    });

    if (!existingSpecialist) {
      return NextResponse.json(
        { error: "Specialist not found" },
        { status: 404 }
      );
    }

    if (existingSpecialist.createdById !== profile.id) {
      return NextResponse.json(
        { error: "You are not authorized to delete this specialist" },
        { status: 403 }
      );
    }

    // Delete the specialist
    await prisma.specialist.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting specialist:", error);
    return NextResponse.json(
      { error: "Failed to delete specialist" },
      { status: 500 }
    );
  }
}
