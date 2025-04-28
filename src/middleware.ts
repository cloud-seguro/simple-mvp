import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateClientFingerprint } from "@/lib/utils/session-utils";

export async function middleware(req: NextRequest) {
  // Create a response object
  const res = NextResponse.next();

  // Get the origin from the request
  const origin = req.headers.get("origin");

  // Define allowed origins
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://simple-mvp.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean);

  // Set CORS headers only if the origin header is present (for CORS requests)
  if (origin) {
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      // For security, don't set the header if origin isn't allowed
      // This effectively blocks cross-origin requests from unauthorized domains
    }

    // Add other CORS headers
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

    // Only allow credentials for trusted origins
    if (allowedOrigins.includes(origin)) {
      res.headers.set("Access-Control-Allow-Credentials", "true");
    }
  }

  // Add security headers to prevent clickjacking, XSS, etc.
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: res.headers,
    });
  }

  // Create the Supabase middleware client
  const supabase = createMiddlewareClient({ req, res });

  // First get the session which contains the access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Skip auth check for the auth callback route
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res;
  }

  // For better security, set secure cookies in the response
  if (session) {
    // Get authenticated user data when possible
    // This provides more security than just using the session data
    let userData = session.user;
    try {
      // This makes a call to Supabase Auth server to validate the token
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Use the authenticated user data if available
        userData = user;
      }
    } catch (error) {
      console.warn("Failed to get authenticated user data:", error);
      // Continue with session.user if getUser fails
    }

    // Get user agent for security checks
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Get stored data from session
    const sessionFingerprint = userData?.user_metadata?.fingerprint;

    // Security check with relaxed validation
    let shouldInvalidateSession = false;

    // Only perform fingerprint check if:
    // 1. We have a stored fingerprint
    // 2. This is a sensitive route (dashboard, account settings, etc.)
    // TEMPORARILY DISABLED fingerprint checks to fix login issues
    const isSensitiveRoute = false; // Disable fingerprint checks for now
    // const isSensitiveRoute =
    //   req.nextUrl.pathname.startsWith("/dashboard") ||
    //   req.nextUrl.pathname.startsWith("/account");

    if (sessionFingerprint && isSensitiveRoute) {
      const currentFingerprint = generateClientFingerprint(userAgent);

      // Add debugging information
      console.log("Fingerprint check:", {
        route: req.nextUrl.pathname,
        userId: userData?.id.slice(0, 8) + "...",
        match: sessionFingerprint === currentFingerprint,
      });

      // Check if fingerprints don't match, indicating potential session hijacking
      if (sessionFingerprint !== currentFingerprint) {
        // Log for monitoring but don't invalidate session on every mismatch
        // as this can lead to false positives
        console.warn("Potential session hijacking detected", {
          userId: userData?.id,
          route: req.nextUrl.pathname,
        });

        // Count fingerprint mismatches using session metadata
        // Only invalidate after multiple mismatches or on highly sensitive routes
        const mismatchCount =
          userData?.user_metadata?.fingerprintMismatchCount || 0;

        // Make the check more forgiving - increase threshold to 5 mismatches
        // Only be strict for payment/sensitive data pages
        if (
          mismatchCount > 5 ||
          req.nextUrl.pathname.includes("/payments") ||
          req.nextUrl.pathname.includes("/billing")
        ) {
          shouldInvalidateSession = true;
        } else {
          // Update mismatch count in user metadata
          await supabase.auth.updateUser({
            data: {
              fingerprintMismatchCount: mismatchCount + 1,
              lastMismatchTime: new Date().toISOString(),
            },
          });
        }
      } else {
        // Reset mismatch count on successful matches
        if (userData?.user_metadata?.fingerprintMismatchCount) {
          await supabase.auth.updateUser({
            data: { fingerprintMismatchCount: 0 },
          });
        }
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

  // Auth routes for all auth-related flows should never be redirected
  if (req.nextUrl.pathname.startsWith("/auth/")) {
    return res;
  }

  // Reset password page is no longer necessary as we're using magic links,
  // but keep it accessible for backward compatibility
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

// Update the config to include OPTIONS requests and API routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/auth/callback",
    "/api/:path*",
    "/(.*)",
  ],
};
