import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabase = createRouteHandlerClient({ cookies });
      await supabase.auth.exchangeCodeForSession(code);

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        try {
          // Check if profile already exists
          const existingProfile = await prisma.profile.findUnique({
            where: { userId: session.user.id },
          });

          // Only create profile if it doesn't exist
          if (!existingProfile) {
            // Create a profile with FREE role
            await prisma.profile.create({
              data: {
                userId: session.user.id,
                firstName: "",
                lastName: "",
                email: session.user.email,
                role: UserRole.FREE,
                active: true,
              },
            });
            console.log(`Profile created for user ${session.user.id}`);

            // Create HTML with script that will read localStorage and update the profile
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
    <div class="message">Completando tu registro...</div>
  </div>
  <script>
    (async function() {
      try {
        // Check if we have pending profile data
        const pendingData = localStorage.getItem('pendingProfileData');
        
        if (pendingData) {
          const profileData = JSON.parse(pendingData);
          
          // Create or update the profile with the saved data
          const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
          });
          
          if (!response.ok) {
            throw new Error('Error updating profile');
          }
          
          // Clear the pending data
          localStorage.removeItem('pendingProfileData');
        }
        
        // Redirect to profile setup or dashboard
        window.location.href = '${requestUrl.origin}/dashboard';
      } catch (error) {
        console.error('Error processing pending profile data:', error);
        // Still redirect to dashboard even if there's an error
        window.location.href = '${requestUrl.origin}/dashboard';
      }
    })();
  </script>
</body>
</html>
            `;

            // Return the HTML that will process the pending profile data
            return new NextResponse(html, {
              headers: { "Content-Type": "text/html" },
            });
          }
        } catch (error) {
          console.error("Error creating profile:", error);
        }
      }

      // For returning users with existing profiles, redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }

    // If no code, redirect to home page
    return NextResponse.redirect(`${requestUrl.origin}`);
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
