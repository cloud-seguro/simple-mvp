"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User, Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";
import { hashPassword } from "@/lib/utils/password-utils";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
    noRedirect?: boolean
  ) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkPasswordStrength: (password: string) => Promise<{
    strength: number;
    requirements: {
      length: boolean;
      uppercase: boolean;
      lowercase: boolean;
      numbers: boolean;
      special: boolean;
    };
  }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  checkPasswordStrength: async () => ({
    strength: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      special: false,
    },
  }),
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch profile function with retry logic
  const fetchProfile = async (userId: string, isAfterSignUp = false) => {
    // Check if we're in the process of creating a profile
    // If so, skip the profile fetch to avoid 404 errors
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("creating_profile") === "true"
    ) {
      console.log("Skipping profile fetch as profile creation is in progress");
      return false;
    }

    let retryCount = 0;
    const maxRetries = isAfterSignUp ? 5 : 2; // More retries after sign-up
    const initialDelay = isAfterSignUp ? 1000 : 300; // Longer initial delay after sign-up

    const attemptFetch = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (!response.ok) {
          // Only throw for non-404 errors or if we've exhausted retries
          if (response.status !== 404 || retryCount >= maxRetries) {
            throw new Error("Failed to fetch profile");
          }
          return false; // Profile not found but we can retry
        }
        const data = await response.json();
        setProfile(data.profile);
        return true; // Success
      } catch (error) {
        if (retryCount >= maxRetries) {
          console.error("Error fetching profile after retries:", error);
          setProfile(null);
        }
        return false;
      }
    };

    // First attempt
    let success = await attemptFetch();

    // Retry logic with exponential backoff
    while (!success && retryCount < maxRetries) {
      retryCount++;
      const delay = initialDelay * 1.5 ** (retryCount - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
      success = await attemptFetch();
    }

    return success;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        // Check if we're in the process of creating a profile
        if (
          typeof window !== "undefined" &&
          localStorage.getItem("creating_profile") !== "true"
        ) {
          fetchProfile(session.user.id);
        }
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session) => {
      console.log("Auth state change event:", event);

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        console.log("User available in session:", session.user.id);

        // For sign-up events, use the retry logic with longer delays
        // But only if we're not in the process of creating a profile
        if (
          typeof window !== "undefined" &&
          localStorage.getItem("creating_profile") !== "true"
        ) {
          // Use string literals for event types
          const isSignUp = event === "SIGNED_UP" || event === "SIGNED_IN";
          console.log(
            "Fetching profile for user:",
            session.user.id,
            "isSignUp:",
            isSignUp
          );
          await fetchProfile(session.user.id, isSignUp);
        } else {
          console.log(
            "Skipping profile fetch as profile creation is in progress"
          );
        }
      } else {
        console.log("No user in session");
        setProfile(null);
      }

      setIsLoading(false);

      if (event === "SIGNED_OUT") {
        router.push("/sign-in");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const signIn = async (
    email: string,
    password: string,
    noRedirect?: boolean
  ) => {
    // Note: We don't hash passwords for Supabase Auth - it handles security properly
    // This is the correct approach as Supabase handles password hashing server-side
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Use the retry logic for profile fetching, but only if we're not creating a profile
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("creating_profile") !== "true"
      ) {
        await fetchProfile(data.user.id, true);
      }
    }

    if (!noRedirect) {
      router.push("/dashboard");
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    try {
      console.log("Starting sign-up process for:", email);

      // Set flag in localStorage to prevent premature profile fetching attempts
      localStorage.setItem("creating_profile", "true");

      const redirectUrl = `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/auth/callback`;

      // Sign up with email verification enabled
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error("Sign-up error:", error);
        throw error;
      }

      console.log("Sign-up successful, verification email sent to:", email);

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        // This means the user already exists but needs to confirm their email
        alert(
          "An account with this email already exists. Please check your email to confirm your account."
        );
      } else if (
        !data?.user?.confirmed_at &&
        data?.user?.email_confirmed_at === null
      ) {
        // New user that needs to confirm their email
        alert(
          "Please check your email for a confirmation link to complete your registration."
        );
      }

      // Clear creating_profile flag after 10 seconds to handle cases where user doesn't click the verification link
      setTimeout(() => {
        localStorage.removeItem("creating_profile");
      }, 10000);
    } catch (error) {
      localStorage.removeItem("creating_profile");
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const checkPasswordStrength = async (password: string) => {
    try {
      // For password strength checking, we can securely use our API
      // We're not sending the actual password that will be stored - just checking requirements
      const { hashedPassword, salt } = hashPassword(password);

      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "check_strength",
          password,
          hashedPassword,
          salt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check password strength");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking password strength:", error);

      // Fallback to client-side checking if API fails
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
      const isLongEnough = password.length >= 8;

      const strengthScore = [
        isLongEnough,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
      ].filter(Boolean).length;

      return {
        strength: strengthScore,
        requirements: {
          length: isLongEnough,
          uppercase: hasUpperCase,
          lowercase: hasLowerCase,
          numbers: hasNumbers,
          special: hasSpecialChar,
        },
      };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        checkPasswordStrength,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
