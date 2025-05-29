import { NextResponse } from "next/server";
import { Resend } from "resend";
import { WelcomeEmail } from "@/components/emails/welcome-email";
import React from "react";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory cache to track recently sent emails (in production, use Redis or similar)
const recentlySentEmails = new Map<string, number>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { firstName, email } = await request.json();

    // Validate the required fields
    if (!firstName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName or email" },
        { status: 400 }
      );
    }

    // Check if this email was recently sent to prevent duplicates
    const cacheKey = `welcome:${email}`;
    const lastSentTime = recentlySentEmails.get(cacheKey);
    const now = Date.now();

    if (lastSentTime && now - lastSentTime < CACHE_EXPIRY) {
      console.log(`Welcome email to ${email} was already sent recently`);
      return NextResponse.json({
        data: { id: "duplicate-prevented" },
        message: "Welcome email already sent recently",
      });
    }

    // Get the base URL for links in the email
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";

    try {
      // Send the welcome email
      console.log(`Sending welcome email to ${email}`);
      const { data, error } = await resend.emails.send({
        from: "SIMPLE - Ciberseguridad <info@ciberseguridadsimple.com>",
        to: [email],
        subject: "¡Bienvenido a SIMPLE! - Tu cuenta está activada",
        react: React.createElement(WelcomeEmail, {
          firstName,
          baseUrl,
        }),
      });

      if (error) {
        console.error("Error sending welcome email with Resend:", error);
        return NextResponse.json({ error }, { status: 400 });
      }

      // If successful, update our cache
      recentlySentEmails.set(cacheKey, now);
      console.log(
        `Welcome email successfully sent to ${email} - ID: ${data?.id || "unknown"}`
      );

      // Clean up expired cache entries periodically
      if (Math.random() < 0.1) {
        // 10% chance to run cleanup on each request
        for (const [key, timestamp] of recentlySentEmails.entries()) {
          if (now - timestamp > CACHE_EXPIRY) {
            recentlySentEmails.delete(key);
          }
        }
      }

      return NextResponse.json({
        data,
        message: "Welcome email sent successfully",
      });
    } catch (resendError) {
      console.error("Caught error with Resend service:", resendError);
      return NextResponse.json(
        { error: "Email service error: " + (resendError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in send-welcome route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
