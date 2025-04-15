import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const type = requestUrl.searchParams.get("type");

    console.log("Auth callback triggered with:", {
      url: request.url,
      code: code ? "present" : "missing",
      type,
    });

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);

      // Check if this is a password recovery flow
      if (type === "recovery") {
        console.log(
          "Password recovery flow detected, redirecting to reset-password"
        );
        return NextResponse.redirect(`${requestUrl.origin}/reset-password`);
      }

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        console.log(`Email verified for user ${session.user.id}`);

        // Create HTML with a message confirming successful verification
        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Email verificado con éxito</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; }
    .container { text-align: center; max-width: 500px; }
    .message { margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Email verificado con éxito</h1>
    <div class="message">Redirigiendo al panel de control...</div>
  </div>
  <script>
    // Short delay before redirecting to dashboard
    setTimeout(() => {
      window.location.href = '${requestUrl.origin}/dashboard';
    }, 1500);
  </script>
</body>
</html>
        `;

        // Return the HTML with simple redirect
        return new NextResponse(html, {
          headers: { "Content-Type": "text/html" },
        });
      }

      // For returning users, redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }

    // If no code, redirect to home page
    return NextResponse.redirect(`${requestUrl.origin}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
