import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      // Get cookie store for auth
      const cookieStore = cookies();

      // Create supabase client with proper error handling
      let supabase;
      try {
        supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      } catch (cookieError) {
        console.error("Cookie parsing error:", cookieError);
        return NextResponse.redirect(
          new URL("/sign-in?error=cookie_error", req.url)
        );
      }

      console.log(
        "Processing auth callback with code:",
        code.substring(0, 5) + "..."
      );

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Error exchanging code for session:", error);
        return NextResponse.redirect(
          new URL("/sign-in?error=auth_error", req.url)
        );
      }

      console.log(
        "Successfully exchanged code for session, redirecting to:",
        next
      );
      return NextResponse.redirect(new URL(next, req.url));
    } catch (error) {
      console.error("Unexpected error during auth callback:", error);
      return NextResponse.redirect(
        new URL("/sign-in?error=auth_error", req.url)
      );
    }
  }

  // Return to sign-in if code is missing
  return NextResponse.redirect(new URL("/sign-in?error=auth_error", req.url));
}
