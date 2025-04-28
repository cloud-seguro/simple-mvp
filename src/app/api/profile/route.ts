import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const {
      userId,
      firstName,
      lastName,
      avatarUrl,
      email,
      phoneNumber,
      company,
      company_role,
    } = json;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a profile with this email already exists (that doesn't belong to this user)
    if (email) {
      const existingProfile = await prisma.profile.findFirst({
        where: {
          email,
          userId: { not: userId }, // Make sure it's not the current user's profile
        },
      });

      if (existingProfile) {
        return new Response(
          JSON.stringify({ error: "Email already in use by another account" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Create or update profile with all fields in a single operation
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        role: UserRole.FREE,
        active: true,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phoneNumber: phoneNumber || null,
        company: company || null,
        company_role: company_role || null,
        avatarUrl: avatarUrl || null,
      },
      create: {
        userId: userId,
        role: UserRole.FREE, // Always set role to FREE for new users
        active: true,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phoneNumber: phoneNumber || null,
        company: company || null,
        company_role: company_role || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return new Response(JSON.stringify({ profile }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Profile API error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Internal server error", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const {
      firstName,
      lastName,
      avatarUrl,
      email,
      phoneNumber,
      company,
      company_role,
      active,
    } = json;

    // Get the user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update the profile
    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        phoneNumber: phoneNumber || null,
        company: company || null,
        company_role: company_role || null,
        avatarUrl: avatarUrl || null,
        active: active ?? profile.active,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
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
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
