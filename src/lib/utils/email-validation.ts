/**
 * Email validation utility functions to prevent sign-up with non-corporate, temporary, or fake emails
 */

// List of common disposable/temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = [
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "sharklasers.com",
  "minutemail.com",
  "10minutemail.com",
  "mailinator.com",
  "yopmail.com",
  "throwawaymail.com",
  "getairmail.com",
  "mailnesia.com",
  "mohmal.com",
  "fakeinbox.com",
  "tempinbox.com",
  "tempemail.net",
  "dispostable.com",
  "trashmail.com",
  "emailfake.com",
  "tempmail.net",
  "generator.email",
  "maildrop.cc",
  "harakirimail.com",
  "mailcatch.com",
  "spamgourmet.com",
  "getnada.com",
  "inboxkitten.com",
  "tempr.email",
  "safemail.icu",
  "meltmail.com",
  "spamherelots.com",
  "incognitomail.com",
  "tempmailo.com",
  // Adding astimei.com and other temp mail services
  "astimei.com",
  "tafmail.com",
  "emailna.co",
  "trx365.com",
  "tmpmail.org",
  "tmpmail.net",
  "tmpeml.com",
  "freemail.ltd",
  "mailto.plus",
  "fexpost.com",
  "altmails.com",
  "dropmail.me",
  "10mail.org",
  "tempinbox.me",
  "spambox.me",
  "mailsac.com",
  "moakt.co",
  "moakt.cc",
  "mailbox.in.ua",
  "emailondeck.com",
  "emailfake.com",
  "eyepaste.com",
  "mailforspam.com",
  "jetable.org",
  "trash-mail.com",
  "dumpmail.de",
  "spambog.com",
  "tempinbox.com",
  "emltmp.com",
  "tempail.com",
  "disposableinbox.com",
  "temp-mail.ru",
  "1secmail.com",
  "1secmail.net",
  "1secmail.org",
  "lroid.com",
  "emlhub.com",
  "emlpro.com",
  "mail-temp.com",
  "etempmail.net",
  "tempmail.dev",
  "email-temp.com",
  "burnermail.io",
  "33mail.com",
  "abcmail.email",
  "discard.email",
  "discardmail.com",
  "maildrop.cc",
];

// List of common consumer email domains (to be excluded if wanting corporate-only)
const CONSUMER_EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "protonmail.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "gmx.com",
  "tutanota.com",
  "mail.ru",
  "inbox.com",
  "live.com",
  "me.com",
  "comcast.net",
  "verizon.net",
  "att.net",
  "msn.com",
  "googlemail.com",
  "rocketmail.com",
  "yahoo.co.uk",
  "yahoo.co.jp",
  "yahoo.fr",
  "yahoo.es",
  "yahoo.com.br",
];

/**
 * Check if the email is from a disposable/temporary email provider
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  // Check against our list of known disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return true;
  }

  // Additional pattern matching for common disposable email patterns
  // Many temporary email services use patterns like:
  // - Domains with "temp", "disposable", "trash", "fake", "mail", etc.
  // - Very short-lived domains often have numbers or random characters
  const disposablePatterns = [
    /temp(mail|box|io|inbo|email|o|e|)/i, // Match various "temp" combinations
    /mail(inator|drop|temp|fake|box)/i, // Match various "mail" combinations
    /trash(mail|box|)/i, // Match trash combinations
    /fake(mail|inbox|box|)/i, // Match fake combinations
    /disposable/i, // Match disposable
    /discard/i, // Match discard
    /throw(away|mail)/i, // Match throw combinations
    /dump(mail|box)/i, // Match dump combinations
    /spam(box|mail|gourmet)/i, // Match spam combinations
    /burn(er|able)/i, // Match burner/burnable
    /guer+il+a/i, // Match guerrilla with variations
    /tmpmail/i, // Match tmpmail
    /yop(mail|box)/i, // Match yopmail
    /10minute/i, // Match 10minute
    /^(tmp|temp)[.-]/i, // Match domains starting with tmp/temp
    /^mail[0-9]+\./i, // Match mail followed by numbers
  ];

  return disposablePatterns.some((pattern) => pattern.test(domain));
}

/**
 * Check if the email is from a consumer email provider (non-corporate)
 */
export function isConsumerEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  return CONSUMER_EMAIL_DOMAINS.includes(domain);
}

/**
 * Validates that an email meets corporate requirements
 * @param email The email to validate
 * @param requireCorporate Whether to require a corporate (non-consumer) email
 * @returns An object with validity and reason
 */
export function validateCorporateEmail(
  email: string,
  requireCorporate: boolean = true
): { isValid: boolean; reason?: string } {
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, reason: "Formato de correo electrónico inválido" };
  }

  // Check for disposable email
  if (isDisposableEmail(email)) {
    return {
      isValid: false,
      reason: "No se permiten correos temporales o desechables",
    };
  }

  // Check for consumer email if corporate is required
  if (requireCorporate && isConsumerEmail(email)) {
    return {
      isValid: false,
      reason: "Por favor utiliza un correo corporativo",
    };
  }

  // Email passes all checks
  return { isValid: true };
}

/**
 * A more advanced validation could include API calls to validate email
 * For example, connecting to services like:
 * - Abstract API
 * - ZeroBounce
 * - Melissa Data
 * - etc.
 */
export async function validateEmailWithAPI(
  email: string
): Promise<{ isValid: boolean; reason?: string }> {
  // This is a placeholder - replace with actual API call if needed
  try {
    // Example: const response = await fetch(`https://api.emailvalidation.io/v1/validate?email=${email}&apikey=YOUR_API_KEY`);
    // const data = await response.json();
    // return { isValid: data.is_valid, reason: data.is_valid ? undefined : data.reason };

    // For now, just use our local validation
    return validateCorporateEmail(email);
  } catch (error) {
    console.error("Error validating email with API:", error);
    // Fallback to basic validation
    return validateCorporateEmail(email);
  }
}
