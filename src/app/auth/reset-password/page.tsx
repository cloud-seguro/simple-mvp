import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// This page handles redirects from the auth email link and
// ensures the code is properly exchanged for a session
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Handle code verification if it exists in the URL
  if (searchParams.code) {
    const code = Array.isArray(searchParams.code)
      ? searchParams.code[0]
      : searchParams.code;

    try {
      // Exchange code for session server-side
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Error exchanging code:", error);
    }
  }

  // Redirect to the main reset password page
  redirect("/reset-password");
}
