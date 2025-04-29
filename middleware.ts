import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define static asset extensions for caching
const STATIC_ASSETS = [
  "/images/",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".ico",
  ".webp",
  ".css",
  ".scss",
  ".js",
  ".json",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".mp4",
  ".webm",
  ".ogg",
  ".pdf",
  ".csv",
];

// Paths that should bypass the middleware
const BYPASS_PATHS = ["/api/", "/_next/", "/favicon.ico"];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // Skip API routes and Next.js internal routes
  if (BYPASS_PATHS.some((path) => pathname.startsWith(path))) {
    return response;
  }

  // Set default security headers for all responses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Apply caching for static assets
  if (STATIC_ASSETS.some((ext) => pathname.includes(ext))) {
    // Cache static assets for a week
    response.headers.set(
      "Cache-Control",
      "public, max-age=604800, stale-while-revalidate=86400"
    );
    return response;
  }

  // For HTML routes, enable stale-while-revalidate for better performance
  if (!pathname.includes(".")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=86400"
    );
  }

  // Add Server-Timing header to help with performance analysis
  response.headers.set("Server-Timing", "middleware;dur=0");

  return response;
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    // Match all paths except API routes, Next.js internals, and static files already handled by Next.js
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
