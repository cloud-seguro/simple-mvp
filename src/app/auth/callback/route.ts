import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Handle code exchange (used in OAuth flows and magic links)
    if (code) {
      console.log("Processing auth callback with code");
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to the requested page
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  } catch (error) {
    console.error("Error in auth callback:", error);
    // Redirect to sign-in page if there's an error
    return NextResponse.redirect(new URL("/sign-in", requestUrl.origin));
  }
}
