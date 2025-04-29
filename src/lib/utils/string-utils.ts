/**
 * Generates a random string of specified length
 * @param length The length of the string to generate
 * @returns A random string
 */
export function getRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomValues = new Uint8Array(length);

  // Use crypto.getRandomValues for secure random generation if available
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      result += chars.charAt(randomValues[i] % chars.length);
    }
  } else {
    // Fallback to Math.random if crypto is not available
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  return result;
}

/**
 * Truncates a string to a maximum length and adds ellipsis if truncated
 * @param str The string to truncate
 * @param maxLength Maximum length of the string
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}

/**
 * Capitalizes the first letter of a string
 * @param str The string to capitalize
 * @returns String with first letter capitalized
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formats a number as a currency string
 * @param value The number to format
 * @param locale The locale to use for formatting (default: 'es-MX')
 * @param currency The currency code (default: 'MXN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  locale = "es-MX",
  currency = "MXN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
