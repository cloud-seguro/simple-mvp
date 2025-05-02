"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Server action to sign out a user
 * This must be used instead of directly calling supabase.auth.signOut()
 * in Server Components, since cookie modification is only allowed
 * in Server Actions or Route Handlers.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}

/**
 * Server action to sign in a user with email and password
 */
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign-in error:", error.message);
      return { error: error.message };
    }

    if (!data?.user) {
      return { error: "Invalid login credentials" };
    }

    // Add a small delay to ensure cookies are properly set
    await new Promise((resolve) => setTimeout(resolve, 100));

    return { success: true, user: data.user };
  } catch (err) {
    console.error("Unexpected error during sign-in:", err);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Server action to sign up a new user
 */
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
