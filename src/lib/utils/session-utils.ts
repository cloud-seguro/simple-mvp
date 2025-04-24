import { SHA256 } from "crypto-js";

/**
 * Generate a fingerprint from browser data only
 * This helps identify potential session hijacking without external API calls
 *
 * @param userAgent User agent string
 * @returns Fingerprint hash
 */
export const generateClientFingerprint = (userAgent: string): string => {
  // Create a fingerprint based on user agent and browser properties
  // This doesn't use IP address to avoid external API calls
  const browserInfo = [
    userAgent,
    typeof window !== "undefined" ? window.navigator.language : "",
    typeof window !== "undefined" ? window.screen.colorDepth.toString() : "",
    typeof window !== "undefined"
      ? `${window.screen.width}x${window.screen.height}`
      : "",
  ].join("|");

  return SHA256(browserInfo).toString();
};

/**
 * Validates that a session is being used from the same browser/device
 * that originally created it
 *
 * @param originalFingerprint The stored fingerprint from session creation
 * @param currentUserAgent Current user agent
 * @returns Whether the session appears valid
 */
export const validateSessionIntegrity = (
  originalFingerprint: string | undefined,
  currentUserAgent: string
): boolean => {
  if (!originalFingerprint) {
    return false; // No fingerprint to compare against
  }

  const currentFingerprint = generateClientFingerprint(currentUserAgent);

  // Compare fingerprints to detect potential session hijacking
  return originalFingerprint === currentFingerprint;
};

/**
 * Extracts a secure token from a cookie string
 *
 * @param cookieString The full cookie string from request/document
 * @param name Cookie name to extract
 * @returns The cookie value or null if not found
 */
export const extractSecureCookie = (
  cookieString: string,
  name: string
): string | null => {
  const match = cookieString.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};
