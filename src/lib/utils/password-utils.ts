import { SHA256 } from "crypto-js";

/**
 * Securely hash a password for client-side operations
 *
 * NOTE: This is NOT meant to replace server-side password hashing!
 * This is an additional security layer for transferring passwords
 * to custom API endpoints, not for Supabase Auth endpoints which
 * already handle passwords securely.
 *
 * @param password The plain text password
 * @param salt Optional salt (default: uses timestamp)
 * @returns The hashed password and salt
 */
export const hashPassword = (
  password: string,
  salt?: string
): { hashedPassword: string; salt: string } => {
  // Use provided salt or generate one from current timestamp and random values
  const useSalt =
    salt || `${Date.now()}-${Math.random().toString(36).substring(2)}`;

  // Create a salted hash
  const hashedPassword = SHA256(`${password}${useSalt}`).toString();

  return {
    hashedPassword,
    salt: useSalt,
  };
};

/**
 * Verify a password against a previously hashed password
 *
 * @param password Plain text password to verify
 * @param hashedPassword Previously hashed password
 * @param salt Salt used in the original hashing
 * @returns Whether the password matches
 */
export const verifyPassword = (
  password: string,
  hashedPassword: string,
  salt: string
): boolean => {
  const newHashedPassword = SHA256(`${password}${salt}`).toString();
  return newHashedPassword === hashedPassword;
};

/**
 * Client-side encryption for passwords before sending to Supabase Auth
 *
 * This acts as a transport layer security measure to ensure passwords
 * are never sent in plain text over the network, even if HTTPS is used.
 *
 * Note: Supabase will still hash this password again server-side.
 *
 * @param password Plain text password
 * @returns Encrypted password safe for network transmission
 */
export const encryptPasswordForTransport = (password: string): string => {
  // Use SHA-256 for a one-way hash of the password
  // This prevents the password from being sent in plain text
  return SHA256(password).toString();
};
