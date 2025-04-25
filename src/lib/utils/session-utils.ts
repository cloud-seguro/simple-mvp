import { SHA256 } from "crypto-js";

/**
 * Generate a fingerprint from browser data only
 * This helps identify potential session hijacking without external API calls
 *
 * @param userAgent User agent string
 * @returns Fingerprint hash
 */
export const generateClientFingerprint = (userAgent: string): string => {
  // In server environment (middleware), we should only use user agent
  // to avoid accessing window which doesn't exist on the server
  if (typeof window === "undefined") {
    // Extract only the browser and OS info for a more stable fingerprint
    // This makes fingerprint matching more tolerant to minor changes
    const browserMatch = userAgent.match(
      /(Chrome|Firefox|Safari|Edge|MSIE|Trident)/i
    );
    const osMatch = userAgent.match(
      /(Windows|Mac|Linux|Android|iOS|iPhone|iPad)/i
    );

    const browserName = browserMatch ? browserMatch[1] : "Unknown";
    const osName = osMatch ? osMatch[1] : "Unknown";

    return SHA256(`${browserName}|${osName}`).toString();
  }

  // Client-side fingerprinting - use a simplified approach for consistency
  const browserInfo = [
    // Extract browser and OS instead of full user agent
    navigator.userAgent.match(
      /(Chrome|Firefox|Safari|Edge|MSIE|Trident)/i
    )?.[1] || "Unknown",
    navigator.userAgent.match(
      /(Windows|Mac|Linux|Android|iOS|iPhone|iPad)/i
    )?.[1] || "Unknown",
    navigator.language,
    // Use broader screen size buckets (rounded to nearest 100)
    `${Math.floor(window.screen.width / 100) * 100}x${Math.floor(window.screen.height / 100) * 100}`,
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
