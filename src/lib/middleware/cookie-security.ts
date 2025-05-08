import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware function to enhance cookie security
 * This function will update any existing auth cookies to include security flags
 */
export function secureCookies(
  req: NextRequest,
  res: NextResponse
): NextResponse {
  // Get all cookies from the request
  const requestCookies = req.cookies;

  // Array of Supabase auth cookie names that should be secured
  const authCookies = [
    "sb-access-token",
    "sb-refresh-token",
    "sb-auth-token",
    "__session",
  ];

  // Check each cookie in the request
  requestCookies.getAll().forEach((cookie) => {
    // If this is an auth-related cookie
    if (authCookies.includes(cookie.name)) {
      // Set the cookie with enhanced security options
      res.cookies.set({
        name: cookie.name,
        value: cookie.value,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
  });

  return res;
}
