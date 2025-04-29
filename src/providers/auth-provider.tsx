"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";
import { secureSupabaseClient } from "@/lib/supabase/client";
import { generateClientFingerprint } from "@/lib/utils/session-utils";
import { validateCorporateEmail } from "@/lib/utils/email-validation";

// URL helper function
const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
};

// Type for profile data during signup (subset of Profile)
interface ProfileSignupData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  company?: string;
  company_role?: string;
  avatarUrl?: string;
}

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
  signUp: (
    email: string,
    password: string,
    profileData: ProfileSignupData
  ) => Promise<void>;
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
  const supabase = secureSupabaseClient;

  // Optimized fetch profile function with smarter retry logic
  const fetchProfile = async (userId: string, isAfterSignUp = false) => {
    // Don't retry too many times
    const maxRetries = isAfterSignUp ? 3 : 1;
    const initialDelay = isAfterSignUp ? 500 : 200;

    // Implement retry logic with async/await and for loop instead of while
    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const response = await fetch(`/api/profile/${userId}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status !== 404 || retryCount >= maxRetries) {
            throw new Error(`Failed to fetch profile: ${response.status}`);
          }
          // Profile not found but we can retry if not at max retries
        } else {
          const data = await response.json();
          setProfile(data.profile);
          return true; // Success
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Profile fetch request timed out");
        } else {
          console.error(
            `Error fetching profile (attempt ${retryCount + 1}):`,
            error
          );
        }
      }

      // If this isn't the last retry, wait before trying again
      if (retryCount < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, initialDelay * Math.pow(1.5, retryCount))
        );
      }
    }

    // If we get here, all retries failed
    console.warn("Failed to fetch profile after all retries");
    setProfile(null);
    return false;
  };

  // Load auth state once on mount
  useEffect(() => {
    const loadInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error loading initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const isSignUp = event === "SIGNED_UP" || event === "SIGNED_IN";
        await fetchProfile(session.user.id, isSignUp);
      } else {
        setProfile(null);
      }

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
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get profile data
        await fetchProfile(data.user.id, true);

        // Capture basic fingerprint in a non-blocking way
        setTimeout(async () => {
          try {
            const fingerprint = generateClientFingerprint(navigator.userAgent);
            await supabase.auth.updateUser({
              data: {
                fingerprint: fingerprint,
                last_login: new Date().toISOString(),
                user_agent: navigator.userAgent,
                fingerprintMismatchCount: 0,
              },
            });
          } catch (err) {
            console.error("Error storing security information:", err);
          }
        }, 500);
      }

      if (!noRedirect) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: ProfileSignupData
  ): Promise<void> => {
    try {
      // Validate email before proceeding
      const emailValidation = validateCorporateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(
          emailValidation.reason || "Dirección de correo electrónico no válida"
        );
      }

      // The secureSupabaseClient already handles password encryption
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getURL() + "auth/callback",
          data: {
            first_name: profileData.firstName || "",
            last_name: profileData.lastName || "",
          },
        },
      });

      if (error) {
        console.error("Sign-up error:", error);
        throw error;
      }

      // Create profile for the new user
      if (data.user) {
        try {
          const response = await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: data.user.id,
              email: email,
              firstName: profileData.firstName || "",
              lastName: profileData.lastName || "",
              phoneNumber: profileData.phoneNumber || "",
              company: profileData.company || "",
              company_role: profileData.company_role || "",
              avatarUrl: profileData.avatarUrl,
            }),
          });

          if (!response.ok) {
            console.error("Error creating profile:", await response.text());
          }

          // Add security metadata in the background
          const fingerprint = generateClientFingerprint(navigator.userAgent);
          setTimeout(async () => {
            try {
              await supabase.auth.updateUser({
                data: {
                  fingerprint: fingerprint,
                  signup_time: new Date().toISOString(),
                  user_agent: navigator.userAgent,
                  fingerprintMismatchCount: 0,
                },
              });
            } catch (err) {
              console.error("Error adding security metadata:", err);
            }
          }, 500);
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        alert(
          "An account with this email already exists. Please check your email to confirm your account."
        );
      } else if (
        !data?.user?.confirmed_at &&
        data?.user?.email_confirmed_at === null
      ) {
        alert(
          "Please check your email for a confirmation link to complete your registration."
        );
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const checkPasswordStrength = async (password: string) => {
    // Client-side password strength checking to avoid network request
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
