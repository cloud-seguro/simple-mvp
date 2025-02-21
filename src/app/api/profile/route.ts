import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { username, fullName, birthDate, avatarUrl, userId } = json;

    if (!userId) {
      console.error("No userId provided");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.create({
      data: {
        userId,
        username,
        fullName,
        birthDate: new Date(birthDate),
        avatarUrl,
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
