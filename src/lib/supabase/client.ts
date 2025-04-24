import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { encryptPasswordForTransport } from "@/lib/utils/password-utils";
import {
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

// Create a secure Supabase client with password encryption and session protection
export const createSecureSupabaseClient = () => {
  // Create the client - note that cookie settings are now managed by middleware
  const supabase = createClientComponentClient();

  // Intercept and wrap the original auth methods to add client-side encryption
  const originalSignIn = supabase.auth.signInWithPassword;
  const originalSignUp = supabase.auth.signUp;
  const originalSignOut = supabase.auth.signOut;

  // Override signInWithPassword to apply client-side encryption
  supabase.auth.signInWithPassword = async (
    credentials: SignInWithPasswordCredentials
  ) => {
    if ("password" in credentials) {
      // Encrypt password before sending to Supabase
      const encryptedPassword = encryptPasswordForTransport(
        credentials.password
      );

      // Call the original method with encrypted password
      return originalSignIn.call(supabase.auth, {
        ...credentials,
        password: encryptedPassword,
      });
    }

    // If no password is provided, just pass through
    return originalSignIn.call(supabase.auth, credentials);
  };

  // Override signUp to apply client-side encryption
  supabase.auth.signUp = async (credentials: SignUpWithPasswordCredentials) => {
    if ("password" in credentials) {
      // Encrypt password before sending to Supabase
      const encryptedPassword = encryptPasswordForTransport(
        credentials.password
      );

      // Call the original method with encrypted password
      return originalSignUp.call(supabase.auth, {
        ...credentials,
        password: encryptedPassword,
      });
    }

    // If no password is provided, just pass through
    return originalSignUp.call(supabase.auth, credentials);
  };

  // Add a security check before each session access
  const originalGetSession = supabase.auth.getSession;
  supabase.auth.getSession = async () => {
    // Check for security cookie to ensure this is a valid session
    const hasSecurity = document.cookie.includes("session_secure=true");

    if (!hasSecurity) {
      // No security cookie present - could be a hijacked session
      // Force sign out for safety
      console.warn("Security validation failed - forcing sign out");
      await originalSignOut.call(supabase.auth);
      return { data: { session: null } };
    }

    return originalGetSession.call(supabase.auth);
  };

  return supabase;
};

// Export a default client instance
export const secureSupabaseClient = createSecureSupabaseClient();
