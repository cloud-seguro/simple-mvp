import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const type = requestUrl.searchParams.get("type");

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);

      // Check if this is a password recovery flow
      if (type === "recovery") {
        // Redirect to reset password page
        return NextResponse.redirect(`${requestUrl.origin}/reset-password`);
      }

      // For all other auth flows, redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }

    // If no code, redirect to home page
    return NextResponse.redirect(`${requestUrl.origin}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
