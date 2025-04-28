import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Middleware helper to check authorization for API routes
 * This provides a base layer of protection for all API routes
 */
export async function withApiAuth(
  req: NextRequest,
  handler: (
    req: NextRequest,
    user: { id: string; email: string | undefined } | null
  ) => Promise<NextResponse>
) {
  try {
    // Create supabase server client
    const supabase = createServerComponentClient({ cookies });

    // Get session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Get authenticated user or null
    const user = session?.user || null;

    // Pass the user info to the handler
    return await handler(req, user ? { id: user.id, email: user.email } : null);
  } catch (error) {
    console.error("API auth middleware error:", error);

    // Return 500 error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Creates a response for unauthorized access
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Creates a response for forbidden access
 */
export function forbiddenResponse(
  message = "Forbidden - Insufficient permissions"
) {
  return NextResponse.json({ error: message }, { status: 403 });
}
