import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateClientFingerprint } from "@/lib/utils/session-utils";

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next();

  // Add security headers to prevent clickjacking, XSS, etc.
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Create the Supabase middleware client
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // For better security, set secure cookies in the response
  if (session) {
    // Get user agent for security checks
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Get stored data from session
    const sessionFingerprint = session.user?.user_metadata?.fingerprint;

    // Security check with relaxed validation
    let shouldInvalidateSession = false;

    // Only invalidate if we have fingerprint data that doesn't match
    if (sessionFingerprint) {
      const currentFingerprint = generateClientFingerprint(userAgent);

      // Check if fingerprints don't match, indicating potential session hijacking
      if (sessionFingerprint !== currentFingerprint) {
        console.warn("Potential session hijacking detected", {
          userId: session.user?.id,
        });
        shouldInvalidateSession = true;
      }
    }

    if (shouldInvalidateSession) {
      // Force re-authentication for suspicious sessions
      await supabase.auth.signOut();

      // Redirect to sign-in page with security warning
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/sign-in";
      redirectUrl.searchParams.set("reason", "security");
      return NextResponse.redirect(redirectUrl);
    }

    // Set HTTP-only cookie that can't be accessed by JavaScript
    // This is an additional security marker checked by the client
    res.cookies.set("session_secure", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
  }

  // Auth routes for password reset flow should never be redirected
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return res;
  }

  // Reset password page should always be accessible
  // It will handle its own recovery token verification
  if (req.nextUrl.pathname === "/reset-password") {
    return res;
  }

  // Forgot password page should be accessible without a session
  if (req.nextUrl.pathname === "/forgot-password") {
    // If user is logged in, redirect to dashboard instead of showing forgot password
    if (session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
    return res;
  }

  // If there's no session and the user is trying to access a protected route
  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/sign-in";
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If there's a session and the user is trying to access auth routes
  if (
    session &&
    (req.nextUrl.pathname.startsWith("/sign-in") ||
      req.nextUrl.pathname.startsWith("/sign-up"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/reset-password",
    "/forgot-password",
    "/auth/:path*",
  ],
};
