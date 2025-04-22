import { redirect } from "next/navigation";

// This page handles redirects from the auth email link
export default async function ResetPasswordPage() {
  // Redirect to the main reset password page where the actual form is
  redirect("/reset-password");
}
