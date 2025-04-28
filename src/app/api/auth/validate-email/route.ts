import { NextRequest, NextResponse } from "next/server";
import { validateCorporateEmail } from "@/lib/utils/email-validation";

/**
 * API endpoint to validate emails before registration
 * This helps prevent client-side validation bypassing
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const validation = validateCorporateEmail(email);

    return NextResponse.json({
      isValid: validation.isValid,
      reason: validation.reason || null,
    });
  } catch (error) {
    console.error("Error validating email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
