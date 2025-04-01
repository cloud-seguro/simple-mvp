import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/utils/password-utils";

export async function POST(request: NextRequest) {
  try {
    const { action, password, hashedPassword, salt } = await request.json();

    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Handle different password-related actions
    switch (action) {
      case "check_strength": {
        // Check password strength
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        // Calculate strength score (0-5)
        const strengthScore = [
          isLongEnough,
          hasUpperCase,
          hasLowerCase,
          hasNumbers,
          hasSpecialChar,
        ].filter(Boolean).length;

        // Return strength info
        return NextResponse.json({
          success: true,
          strength: strengthScore,
          requirements: {
            length: isLongEnough,
            uppercase: hasUpperCase,
            lowercase: hasLowerCase,
            numbers: hasNumbers,
            special: hasSpecialChar,
          },
        });
      }

      case "verify": {
        // Verify the password with salt
        if (!hashedPassword || !salt) {
          return NextResponse.json(
            { success: false, error: "Missing parameters" },
            { status: 400 }
          );
        }

        const isValid = verifyPassword(password, hashedPassword, salt);
        return NextResponse.json({ success: true, isValid });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Password API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
