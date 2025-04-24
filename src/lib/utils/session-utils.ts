import { SHA256 } from "crypto-js";

/**
 * Generate a fingerprint from request/browser data
 * This helps identify potential session hijacking
 *
 * @param userAgent User agent string
 * @param ip IP address
 * @returns Fingerprint hash
 */
export const generateClientFingerprint = (
  userAgent: string,
  ip: string
): string => {
  // Create a fingerprint based on key identifiers
  // This is a simple implementation - real fingerprinting would be more sophisticated
  return SHA256(`${userAgent}|${ip}`).toString();
};

/**
 * Validates that a session is being used from the same browser/device
 * that originally created it
 *
 * @param originalFingerprint The stored fingerprint from session creation
 * @param currentUserAgent Current user agent
 * @param currentIp Current IP address
 * @returns Whether the session appears valid
 */
export const validateSessionIntegrity = (
  originalFingerprint: string | undefined,
  currentUserAgent: string,
  currentIp: string
): boolean => {
  if (!originalFingerprint) {
    return false; // No fingerprint to compare against
  }

  const currentFingerprint = generateClientFingerprint(
    currentUserAgent,
    currentIp
  );

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
