"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  refreshProfile: () => Promise<boolean>;
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
  refreshProfile: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = secureSupabaseClient;

  // Wrap fetchProfile in useCallback to stabilize it for dependency array
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (!response.ok) {
        console.error("Error fetching profile:", await response.text());
        return false;
      }
      const data = await response.json();
      // Extract the nested profile if it exists, otherwise use the data directly
      const profileData = data.profile || data;
      setProfile(profileData);
      return true;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return false;
    }
  }, []);

  // Wrap signOut in useCallback to stabilize it for dependency array
  const signOut = useCallback(
    async (silent = false) => {
      try {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);

        if (!silent) {
          router.push("/");
        }
      } catch (error) {
        console.error("Sign-out error:", error);
      }
    },
    [router, supabase.auth]
  );

  // Load auth state once on mount
  useEffect(() => {
    const loadInitialSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          await signOut(true);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileSuccess = await fetchProfile(session.user.id);

          // If we have a session but can't get a profile, something's wrong
          if (!profileSuccess) {
            console.error(
              "Valid session but profile fetch failed, signing out"
            );
            await signOut(true);
            return;
          }
        }
      } catch (error) {
        console.error("Error loading initial session:", error);
        await signOut(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileSuccess = await fetchProfile(session.user.id);

          // If auth changed to a valid session but profile fails, something's wrong
          if (!profileSuccess && event !== "SIGNED_OUT") {
            console.error(
              "Auth state changed but profile fetch failed, signing out"
            );
            await signOut(true);
            return;
          }
        } else {
          setProfile(null);
        }

        if (event === "SIGNED_OUT") {
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error during auth state change:", error);
        await signOut(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, fetchProfile, signOut, supabase.auth]);

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
        const profileSuccess = await fetchProfile(data.user.id);

        // If we successfully authenticated but can't get a profile, sign out
        if (!profileSuccess) {
          console.error(
            "Auth successful but profile fetch failed, signing out"
          );
          await signOut(true);
          throw new Error(
            "Unable to fetch your profile. Please try again later."
          );
        }

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
          emailRedirectTo: getURL() + "dashboard",
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
            // If profile creation fails, attempt to clean up by signing out
            await signOut(true);
            throw new Error("Error creating user profile");
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
          await signOut(true);
          throw profileError;
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut: () => signOut(false),
        checkPasswordStrength,
        refreshProfile: async () => (user ? fetchProfile(user.id) : false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
