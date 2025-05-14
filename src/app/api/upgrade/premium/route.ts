import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Now that we're using Stripe, we'll redirect to the upgrade page
    // with the pricing options instead of directly upgrading the user
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL(
          "/sign-in",
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        )
      );
    }

    // Redirect to the upgrade page
    return NextResponse.redirect(
      new URL(
        "/upgrade",
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      )
    );
  } catch (error) {
    console.error("Error in upgrade route:", error);
    return NextResponse.redirect(
      new URL(
        "/upgrade?error=true",
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      )
    );
  }
}
