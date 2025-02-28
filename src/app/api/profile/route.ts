import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { user_id, first_name, last_name, birth_date, avatar_url } = json;

    if (!user_id) {
      console.error("No user_id provided");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        user_id,
        firstName: first_name,
        lastName: last_name,
        birth_date: birth_date ? new Date(birth_date) : null,
        avatar_url,
        role: "USER",
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
