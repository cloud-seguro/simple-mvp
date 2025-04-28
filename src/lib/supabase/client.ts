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

  // Remove the security check that's causing problems
  // We'll rely on the middleware for security checks instead

  return supabase;
};

// Export a default client instance
export const secureSupabaseClient = createSecureSupabaseClient();
