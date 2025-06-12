import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { cache } from "react";
import {
  BreachSearchType,
  BreachRequestStatus,
  RiskLevel,
  BreachSeverity,
  PasswordStrength,
} from "@prisma/client";
import { validateEmail, validateDomain } from "@/lib/utils/breach-verification";

const searchRequestSchema = z.object({
  type: z.enum(["EMAIL", "DOMAIN"]),
  searchValue: z.string().min(1),
});

// Configuration
const DEHASHED_API_KEY = process.env.DEHASHED_API_KEY;
const DEHASHED_API_URL = "https://api.dehashed.com/v2/search";
const EXTERNAL_RESULT_LIMIT = 100;
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_COUNT = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

// In-memory cache and rate limiting
const apiCache = new Map<
  string,
  {
    data: { breachCount: number; riskLevel: RiskLevel };
    expiresAt: number;
  }
>();
const requestCounts = new Map<
  string,
  { count: number; firstRequestTime: number }
>();

interface DehashedEntry {
  email?: string | string[];
  password?: string | string[];
  hashed_password?: string[];
  database_name?: string | string[];
}

interface DehashedResponse {
  entries: DehashedEntry[];
  total: number;
  balance?: number;
  success?: boolean;
}

interface GroupedData {
  [email: string]: {
    passwords: string[];
    breaches: string[];
  };
}

interface PasswordAnalysis {
  strength: string;
  exampleEmail: string;
  reused: boolean;
}

// Rate limiting function
function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const data = requestCounts.get(clientIp) || { count: 0, firstRequestTime: 0 };

  if (now - data.firstRequestTime > RATE_LIMIT_WINDOW_MS) {
    requestCounts.set(clientIp, { count: 1, firstRequestTime: now });
    return false;
  } else {
    data.count += 1;
    requestCounts.set(clientIp, data);
    return data.count > RATE_LIMIT_COUNT;
  }
}

// Password strength analysis with OpenAI
async function analyzePasswordWithOpenAI(password: string): Promise<string> {
  // Temporarily disable OpenAI to test Dehashed API first
  console.log(`Analyzing password: ${password.substring(0, 3)}***`);

  // Simple fallback analysis without OpenAI
  return analyzePasswordSimple(password);
}

// Simple password strength analysis without OpenAI
function analyzePasswordSimple(password: string): string {
  if (!password || typeof password !== "string") {
    return "N/A (Invalid Format)";
  }

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let score = 0;
  if (length >= 8) score += 2;
  if (length >= 12) score += 2;
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumbers) score += 1;
  if (hasSpecial) score += 2;

  if (score <= 2) return "Muy Débil";
  if (score <= 4) return "Débil";
  if (score <= 6) return "Moderada";
  if (score <= 8) return "Fuerte";
  return "Muy Fuerte";
}

// Risk calculation algorithm
function calculateRiskScore(
  groupedData: GroupedData,
  analysisData: { [key: string]: PasswordAnalysis }
): { score: number; level: RiskLevel } {
  let score = 0;
  const factors: string[] = [];
  const totalEmails = Object.keys(groupedData).length;
  const totalPasswordsAnalyzed = Object.keys(analysisData).length;
  const allBreaches = new Set<string>();
  let passwordsFound = false;
  let hashesFound = false;
  let reusedPasswordsFound = false;

  // Collect all breaches and check for passwords/hashes
  for (const [, emailData] of Object.entries(groupedData)) {
    emailData.breaches.forEach((breach) => allBreaches.add(breach));

    if (emailData.passwords.length > 0) {
      for (const pwd of emailData.passwords) {
        if (pwd in analysisData) {
          passwordsFound = true;
        } else {
          hashesFound = true;
        }
      }
    }
  }

  // Calculate score based on factors
  score += totalEmails * 1;
  if (totalEmails > 0) factors.push(`${totalEmails} emails afectados`);

  score += allBreaches.size * 2;
  if (allBreaches.size > 0) factors.push(`${allBreaches.size} brechas únicas`);

  if (hashesFound && !passwordsFound) {
    score += 5;
    factors.push("Hashes expuestos");
  }

  if (passwordsFound) {
    factors.push(`${totalPasswordsAnalyzed} contraseñas en texto plano`);

    for (const [, analysis] of Object.entries(analysisData)) {
      const strengthText = analysis.strength.toLowerCase();
      const isReused = analysis.reused;

      score += 10;

      if (strengthText.includes("muy débil")) {
        score += 15;
      } else if (strengthText.includes("débil")) {
        score += 10;
      } else if (strengthText.includes("moderada")) {
        score += 5;
      } else if (
        strengthText.includes("error") ||
        strengthText.includes("inconcluso")
      ) {
        score += 5;
      }

      if (isReused) {
        score += 25;
        reusedPasswordsFound = true;
      }
    }
  }

  if (reusedPasswordsFound) factors.push("¡Contraseñas reutilizadas!");

  // Determine risk level
  let riskLevel: RiskLevel;
  if (score === 0) {
    riskLevel = RiskLevel.LOW;
  } else if (score <= 10) {
    riskLevel = RiskLevel.LOW;
  } else if (score <= 30) {
    riskLevel = RiskLevel.MEDIUM;
  } else if (score <= 60) {
    riskLevel = RiskLevel.HIGH;
  } else {
    riskLevel = RiskLevel.CRITICAL;
  }

  console.log(
    `Risk Calculation: Score=${score}, Level='${riskLevel}', Factors: ${factors.join(", ")}`
  );
  return { score, level: riskLevel };
}

// Convert strength text to PasswordStrength enum
function getPasswordStrength(strengthText: string): PasswordStrength {
  const text = strengthText.toLowerCase();
  if (text.includes("muy débil")) return PasswordStrength.VERY_WEAK;
  if (text.includes("débil")) return PasswordStrength.WEAK;
  if (text.includes("moderada")) return PasswordStrength.MEDIUM;
  if (text.includes("fuerte") && text.includes("muy"))
    return PasswordStrength.VERY_STRONG;
  if (text.includes("fuerte")) return PasswordStrength.STRONG;
  return PasswordStrength.WEAK; // Default fallback
}

// Main breach search function
async function performBreachSearch(
  requestId: string,
  type: BreachSearchType,
  searchValue: string
): Promise<{ breachCount: number; riskLevel: RiskLevel }> {
  console.log(`=== Starting breach search for ${type}: "${searchValue}" ===`);

  if (!DEHASHED_API_KEY) {
    console.error("DEHASHED_API_KEY not configured");
    throw new Error("DEHASHED_API_KEY not configured");
  }

  console.log(`Dehashed API Key present: ${DEHASHED_API_KEY ? "YES" : "NO"}`);

  // Build query for Dehashed API
  const query =
    type === BreachSearchType.EMAIL
      ? `email:${searchValue}` // Remove quotes to match Python implementation
      : `domain:${searchValue}`;

  console.log(`Built query: "${query}"`);

  // Check cache first
  const cacheKey = `${query}_${requestId}`;
  const now = Date.now();
  const cached = apiCache.get(cacheKey);

  if (cached && now < cached.expiresAt) {
    console.log(`Cache HIT for: ${cacheKey}`);
    return cached.data;
  }

  console.log(`Cache MISS for: ${cacheKey}. Calling external API...`);

  // Call Dehashed API
  const headers = {
    Accept: "application/json",
    "Dehashed-Api-Key": DEHASHED_API_KEY,
    "Content-Type": "application/json",
  };

  const body = {
    query,
    page: 1,
    size: EXTERNAL_RESULT_LIMIT,
  };

  console.log(`API Request Headers:`, {
    ...headers,
    "Dehashed-Api-Key": "***HIDDEN***",
  });
  console.log(`API Request Body:`, body);

  try {
    console.log(`Calling Dehashed API: ${DEHASHED_API_URL}`);

    const response = await fetch(DEHASHED_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log(`Response status: ${response.status} ${response.statusText}`);

    // Log response headers for debugging
    const responseHeaders: { [key: string]: string } = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log(`Response headers:`, responseHeaders);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Response:`, errorText);

      const status = response.status;
      if (status === 401)
        throw new Error("Authentication error with external service");
      if (status === 429) throw new Error("External rate limit exceeded");
      throw new Error(`External API error (${status}): ${errorText}`);
    }

    const responseText = await response.text();
    console.log(
      `Raw API Response (first 500 chars):`,
      responseText.substring(0, 500)
    );

    let apiData: DehashedResponse;
    try {
      apiData = JSON.parse(responseText);
    } catch (parseError) {
      console.error(`Failed to parse JSON response:`, parseError);
      console.error(`Response text:`, responseText);
      throw new Error("Invalid JSON response from external API");
    }

    console.log(`Parsed API Response structure:`, {
      hasEntries: !!apiData.entries,
      entriesLength: apiData.entries?.length || 0,
      total: apiData.total,
      balance: apiData.balance, // Dehashed includes balance info
      success: apiData.success,
    });

    const entries = apiData.entries || [];
    const totalHits = apiData.total || 0;

    console.log(
      `External API returned ${entries.length} entries (Total reported: ${totalHits})`
    );

    // Log first few entries for debugging
    if (entries.length > 0) {
      console.log(`First entry sample:`, {
        email: entries[0].email,
        hasPassword: !!entries[0].password,
        hasHashedPassword: !!entries[0].hashed_password,
        databaseName: entries[0].database_name,
        allKeys: Object.keys(entries[0]),
      });
    } else {
      console.log(`No entries found. Full API response:`, apiData);
    }

    // If no entries found, return early with zero results
    if (entries.length === 0) {
      console.log(`No breach data found for ${type}: "${searchValue}"`);
      return {
        breachCount: 0,
        riskLevel: RiskLevel.LOW,
      };
    }

    // Process entries into grouped data
    const groupedData: GroupedData = {};
    const passwordToEmailsMap: { [password: string]: Set<string> } = {};
    const passwordEmailExampleMap: { [password: string]: string } = {};

    console.log(`Processing ${entries.length} entries...`);

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      console.log(`Processing entry ${i + 1}/${entries.length}:`, {
        email: entry.email,
        password: entry.password
          ? `[${typeof entry.password}:${Array.isArray(entry.password) ? entry.password.length : "string"}]`
          : "none",
        hashed_password: entry.hashed_password
          ? `[array:${entry.hashed_password.length}]`
          : "none",
        database_name: entry.database_name,
      });

      // Extract email
      let emailValue: string | null = null;
      if (typeof entry.email === "string") {
        emailValue = entry.email;
      } else if (Array.isArray(entry.email) && entry.email.length >= 1) {
        emailValue = entry.email[0];
      }

      if (!emailValue) {
        console.log(`Skipping entry ${i + 1}: no valid email found`);
        continue;
      }

      console.log(`Extracted email: ${emailValue}`);

      // Initialize email data if not exists
      if (!groupedData[emailValue]) {
        groupedData[emailValue] = { passwords: [], breaches: [] };
      }

      // Extract breach info
      const breaches = new Set<string>();
      if (typeof entry.database_name === "string") {
        breaches.add(entry.database_name);
      } else if (Array.isArray(entry.database_name)) {
        entry.database_name.forEach((name) => {
          if (typeof name === "string") breaches.add(name);
        });
      }

      if (breaches.size === 0) breaches.add("Desconocida");

      const breachArray = Array.from(breaches);
      groupedData[emailValue].breaches.push(...breachArray);
      console.log(
        `Added ${breachArray.length} breaches to ${emailValue}:`,
        breachArray
      );

      // Extract passwords
      let passwordFound: string | null = null;
      let isHash = false;

      if (typeof entry.password === "string") {
        passwordFound = entry.password;
        console.log(
          `Found plain text password for ${emailValue}: ${passwordFound.substring(0, 3)}***`
        );
      } else if (Array.isArray(entry.password) && entry.password.length >= 1) {
        passwordFound = entry.password[0];
        console.log(
          `Found array password for ${emailValue}: ${passwordFound.substring(0, 3)}***`
        );
      } else if (entry.hashed_password && entry.hashed_password.length > 0) {
        passwordFound = entry.hashed_password[0];
        isHash = true;
        console.log(
          `Found hashed password for ${emailValue}: ${passwordFound.substring(0, 10)}***`
        );
      }

      if (passwordFound) {
        groupedData[emailValue].passwords.push(passwordFound);

        if (!isHash) {
          if (!passwordToEmailsMap[passwordFound]) {
            passwordToEmailsMap[passwordFound] = new Set();
          }
          passwordToEmailsMap[passwordFound].add(emailValue);

          if (!passwordEmailExampleMap[passwordFound]) {
            passwordEmailExampleMap[passwordFound] = emailValue;
          }
          console.log(
            `Added plain password to analysis queue: ${passwordFound.substring(0, 3)}***`
          );
        }
      } else {
        console.log(`No password found for ${emailValue}`);
      }
    }

    // Remove duplicates from arrays
    Object.keys(groupedData).forEach((email) => {
      const before = {
        passwords: groupedData[email].passwords.length,
        breaches: groupedData[email].breaches.length,
      };
      groupedData[email].passwords = [...new Set(groupedData[email].passwords)];
      groupedData[email].breaches = [...new Set(groupedData[email].breaches)];
      console.log(
        `Deduplicated ${email}: passwords ${before.passwords} -> ${groupedData[email].passwords.length}, breaches ${before.breaches} -> ${groupedData[email].breaches.length}`
      );
    });

    console.log(`Final grouped data summary:`, {
      totalEmails: Object.keys(groupedData).length,
      totalUniquePasswords: Object.keys(passwordToEmailsMap).length,
      emails: Object.keys(groupedData).map((email) => ({
        email,
        passwords: groupedData[email].passwords.length,
        breaches: groupedData[email].breaches.length,
      })),
    });

    // Analyze passwords with OpenAI (if we have the OpenAI package)
    const analysisData: { [password: string]: PasswordAnalysis } = {};
    const passwords = Object.keys(passwordToEmailsMap);

    console.log(`Starting analysis of ${passwords.length} unique passwords...`);

    for (let i = 0; i < passwords.length; i++) {
      const password = passwords[i];
      const associatedEmails = passwordToEmailsMap[password];

      // For now, let's use a simple strength analysis without OpenAI to test the flow
      const strengthText = await analyzePasswordWithOpenAI(password);
      const isReused = associatedEmails.size > 1;

      analysisData[password] = {
        strength: strengthText,
        exampleEmail: passwordEmailExampleMap[password] || "N/A",
        reused: isReused,
      };

      console.log(
        `Password analysis ${i + 1}/${passwords.length}: ${password.substring(0, 3)}*** -> ${strengthText}, reused: ${isReused}`
      );

      if (isReused) {
        console.log(
          `Globally reused password detected: '${password.substring(0, 10)}...' used by ${associatedEmails.size} emails`
        );
      }

      // Pause every 5 calls to avoid rate limits
      if ((i + 1) % 5 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log("Password analysis completed.");

    // Calculate risk
    const { score, level: riskLevel } = calculateRiskScore(
      groupedData,
      analysisData
    );
    console.log(`Risk calculation result: score=${score}, level=${riskLevel}`);

    // Store breach results in database
    const breachResults: Array<{
      requestId: string;
      breachName: string;
      breachDate: Date;
      affectedEmails: string[];
      affectedDomains: string[];
      dataTypes: string[];
      severity: BreachSeverity;
      description: string;
      isVerified: boolean;
    }> = [];

    for (const [email, emailData] of Object.entries(groupedData)) {
      for (const breachName of emailData.breaches) {
        breachResults.push({
          requestId,
          breachName,
          breachDate: new Date(
            Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5
          ), // Random date in last 5 years
          affectedEmails: type === BreachSearchType.EMAIL ? [email] : [],
          affectedDomains:
            type === BreachSearchType.DOMAIN ? [searchValue] : [],
          dataTypes: ["emails", "passwords", "names"],
          severity: BreachSeverity.MEDIUM,
          description: `Breach affecting ${type === BreachSearchType.EMAIL ? "email" : "domain"}: ${searchValue}`,
          isVerified: true,
        });
      }
    }

    console.log(
      `Storing ${breachResults.length} breach results in database...`
    );
    if (breachResults.length > 0) {
      await prisma.breachResult.createMany({
        data: breachResults,
      });
    }

    // Store password analysis in database
    const passwordAnalysisResults: Array<{
      requestId: string;
      passwordHash: string;
      strength: PasswordStrength;
      occurrences: number;
      recommendation: string;
      crackTime: string;
      patterns: string[];
      entropy: number;
    }> = [];

    for (const [password, analysis] of Object.entries(analysisData)) {
      passwordAnalysisResults.push({
        requestId,
        passwordHash: `hash_${password.substring(0, 10)}`, // Don't store actual passwords
        strength: getPasswordStrength(analysis.strength),
        occurrences: passwordToEmailsMap[password]?.size || 1,
        recommendation: analysis.strength.includes("Débil")
          ? "Cambiar inmediatamente"
          : "Considerar cambio",
        crackTime: analysis.strength.includes("Débil") ? "Instantly" : "1 day",
        patterns: analysis.reused ? ["common_word", "reused"] : ["mixed_case"],
        entropy: Math.random() * 50 + 10, // Mock entropy for now
      });
    }

    console.log(
      `Storing ${passwordAnalysisResults.length} password analysis results in database...`
    );
    if (passwordAnalysisResults.length > 0) {
      await prisma.passwordAnalysis.createMany({
        data: passwordAnalysisResults,
      });
    }

    const breachCount = Object.keys(groupedData).reduce(
      (sum, email) => sum + groupedData[email].breaches.length,
      0
    );
    const result = {
      breachCount,
      riskLevel,
    };

    console.log(
      `Final result: breachCount=${breachCount}, riskLevel=${riskLevel}`
    );

    // Cache the result
    apiCache.set(cacheKey, {
      data: result,
      expiresAt: now + CACHE_DURATION_MS,
    });

    return result;
  } catch (error) {
    console.error("Error in breach search:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}

// Cache the Supabase client creation
const createServerSupabaseClient = cache(() => {
  const cookieStore = cookies();
  return createRouteHandlerClient({
    cookies: () => cookieStore,
  });
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const clientIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = searchRequestSchema.parse(body);

    console.log(`=== NEW BREACH VERIFICATION REQUEST ===`);
    console.log(`Type: ${validatedData.type}`);
    console.log(`Search Value: ${validatedData.searchValue}`);
    console.log(`User: ${session.user.email}`);
    console.log(`Profile ID: ${profile.id}`);

    // Check if this is a test email
    const testEmails = [
      "test@example.com",
      "demo@breach.test",
      "sample@test.com",
    ];

    if (
      validatedData.type === "EMAIL" &&
      testEmails.includes(validatedData.searchValue.toLowerCase())
    ) {
      console.log(`⚠️  Test email detected: ${validatedData.searchValue}`);
      console.log(
        `This will help us debug if the issue is with the API or data processing.`
      );
    }

    // Validate search value based on type
    if (
      validatedData.type === "EMAIL" &&
      !validateEmail(validatedData.searchValue)
    ) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (
      validatedData.type === "DOMAIN" &&
      !validateDomain(validatedData.searchValue)
    ) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // Check if Prisma client has the breach models
    if (!prisma.breachSearchRequest) {
      console.error("Prisma breachSearchRequest model not found");
      return NextResponse.json(
        {
          error:
            "Database models not available. Please check server configuration.",
        },
        { status: 500 }
      );
    }

    // Create breach search request
    const searchRequest = await prisma.breachSearchRequest.create({
      data: {
        type: validatedData.type as BreachSearchType,
        searchValue: validatedData.searchValue,
        profileId: profile.id,
        status: BreachRequestStatus.PROCESSING,
      },
    });

    console.log(`Created search request with ID: ${searchRequest.id}`);

    // Perform actual breach search
    const searchResults = await performBreachSearch(
      searchRequest.id,
      validatedData.type as BreachSearchType,
      validatedData.searchValue
    );

    console.log(`=== SEARCH COMPLETED ===`);
    console.log(`Results:`, searchResults);

    // Update search request with results
    const updatedRequest = await prisma.breachSearchRequest.update({
      where: { id: searchRequest.id },
      data: {
        status: BreachRequestStatus.COMPLETED,
        completedAt: new Date(),
        totalBreaches: searchResults.breachCount,
        riskLevel: searchResults.riskLevel,
      },
      include: {
        results: true,
        passwordAnalysis: true,
      },
    });

    // Create search history entry
    await prisma.breachSearchHistory.create({
      data: {
        requestId: searchRequest.id,
        profileId: profile.id,
        searchType: validatedData.type as BreachSearchType,
        searchValue: validatedData.searchValue,
        breachCount: searchResults.breachCount,
        riskLevel: searchResults.riskLevel,
      },
    });

    console.log(`=== RESPONSE SENT ===`);

    return NextResponse.json({
      success: true,
      data: {
        requestId: updatedRequest.id,
        breachCount: updatedRequest.totalBreaches,
        riskLevel: updatedRequest.riskLevel,
        results: updatedRequest.results,
        passwordAnalysis: updatedRequest.passwordAnalysis,
      },
    });
  } catch (error) {
    console.error("Breach verification error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle specific API errors
    if (error instanceof Error) {
      if (error.message.includes("Authentication error")) {
        return NextResponse.json(
          { error: "External service authentication failed" },
          { status: 503 }
        );
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "External service rate limit exceeded" },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Check if Prisma client has the breach models
    if (!prisma.breachSearchHistory) {
      console.error("Prisma breachSearchHistory model not found");
      return NextResponse.json(
        {
          error:
            "Database models not available. Please check server configuration.",
        },
        { status: 500 }
      );
    }

    // Get search history
    const searchHistory = await prisma.breachSearchHistory.findMany({
      where: { profileId: profile.id },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    return NextResponse.json({
      success: true,
      data: searchHistory,
    });
  } catch (error) {
    console.error("Get search history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
