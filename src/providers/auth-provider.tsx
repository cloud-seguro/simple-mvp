"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/profile";
import { hashPassword } from "@/lib/utils/password-utils";
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

  // Fetch profile function with retry logic
  const fetchProfile = async (userId: string, isAfterSignUp = false) => {
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
        fetchProfile(session.user.id);
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
    try {
      // The secureSupabaseClient already handles password encryption
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // First fetch the profile to ensure we have user data
        await fetchProfile(data.user.id, true);

        // Then update security metadata in a separate call
        // This prevents potential race conditions
        try {
          const userAgent = navigator.userAgent;
          // Generate a fingerprint based on user agent and browser properties
          const fingerprint = generateClientFingerprint(userAgent);

          // Store additional browser data for more accurate matching
          const browserData = {
            fingerprint: fingerprint,
            last_login: new Date().toISOString(),
            user_agent: userAgent,
            // Reset the mismatch counter on successful login
            fingerprintMismatchCount: 0,
            // Add these browser-specific properties for better security checks
            language: navigator.language,
            platform: navigator.platform,
            // Store basic screen info separately to help with comparisons
            screen_width: window.screen.width,
            screen_height: window.screen.height,
          };

          // Update user metadata with security information
          // Use a small delay to prevent race conditions with other auth operations
          setTimeout(async () => {
            try {
              await supabase.auth.updateUser({
                data: browserData,
              });
              console.log("Security fingerprint updated successfully");
            } catch (err) {
              console.error("Delayed metadata update failed:", err);
            }
          }, 1000);
        } catch (secError) {
          console.error("Error storing security information:", secError);
          // Continue even if security update fails
        }
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
      console.log("Starting sign-up process for:", email);

      // Validate email before proceeding
      const emailValidation = validateCorporateEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(
          emailValidation.reason || "Dirección de correo electrónico no válida"
        );
      }

      // Generate a device fingerprint for security
      const userAgent = navigator.userAgent;
      const fingerprint = generateClientFingerprint(userAgent);

      // The secureSupabaseClient already handles password encryption
      // Store minimal data during sign-up to avoid potential issues
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

      console.log("Sign-up successful, verification email sent to:", email);

      // Create profile for the new user
      if (data.user) {
        try {
          // Create the profile immediately
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
          } else {
            console.log("Profile created successfully for user:", data.user.id);

            // After successful profile creation, add security metadata
            setTimeout(async () => {
              try {
                // Store more detailed browser fingerprint data
                const browserData = {
                  fingerprint: fingerprint,
                  signup_time: new Date().toISOString(),
                  user_agent: navigator.userAgent,
                  // Initialize the mismatch counter to 0
                  fingerprintMismatchCount: 0,
                  // Add these browser-specific properties for better security checks
                  language: navigator.language,
                  platform: navigator.platform,
                  // Store basic screen info separately to help with comparisons
                  screen_width: window.screen.width,
                  screen_height: window.screen.height,
                };

                await supabase.auth.updateUser({
                  data: browserData,
                });
                console.log("Security metadata added for new user");
              } catch (err) {
                console.error("Error adding security metadata:", err);
              }
            }, 1000);
          }
        } catch (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }

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
    } catch (error) {
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
