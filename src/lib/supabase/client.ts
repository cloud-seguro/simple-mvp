import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { encryptPasswordForTransport } from "@/lib/utils/password-utils";

// Create a secure Supabase client with password encryption
export const createSecureSupabaseClient = () => {
  const supabase = createClientComponentClient();

  // Intercept and wrap the original auth methods to add client-side encryption
  const originalSignIn = supabase.auth.signInWithPassword;
  const originalSignUp = supabase.auth.signUp;

  // Override signInWithPassword to apply client-side encryption
  supabase.auth.signInWithPassword = async ({ email, password, ...rest }) => {
    // Encrypt password before sending to Supabase
    const encryptedPassword = encryptPasswordForTransport(password);

    // Call the original method with encrypted password
    return originalSignIn.call(supabase.auth, {
      email,
      password: encryptedPassword,
      ...rest,
    });
  };

  // Override signUp to apply client-side encryption
  supabase.auth.signUp = async ({ email, password, ...rest }) => {
    // Encrypt password before sending to Supabase
    const encryptedPassword = encryptPasswordForTransport(password);

    // Call the original method with encrypted password
    return originalSignUp.call(supabase.auth, {
      email,
      password: encryptedPassword,
      ...rest,
    });
  };

  return supabase;
};

// Export a default client instance
export const secureSupabaseClient = createSecureSupabaseClient();
