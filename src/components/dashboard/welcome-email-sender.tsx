"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

interface WelcomeEmailSenderProps {
  firstName: string;
  email: string;
}

export function WelcomeEmailSender({
  firstName,
  email,
}: WelcomeEmailSenderProps) {
  const searchParams = useSearchParams();
  const hasTriedSendingRef = useRef(false);

  useEffect(() => {
    const handleWelcomeEmail = async () => {
      // Check for subscription_success parameter and ensure we haven't already tried sending
      const hasSubscriptionSuccess =
        searchParams.get("subscription_success") === "true";

      if (
        hasSubscriptionSuccess &&
        !hasTriedSendingRef.current &&
        firstName &&
        email
      ) {
        // Set the flag immediately to prevent multiple attempts
        hasTriedSendingRef.current = true;

        try {
          console.log("Sending welcome email after successful subscription...");

          const response = await fetch("/api/send-welcome", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName,
              email,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to send welcome email");
          }

          console.log("Welcome email sent successfully:", result);
        } catch (error) {
          console.error("Error sending welcome email:", error);
          // Don't show user-facing error for welcome email failures
          // as it's not critical to the user experience
        }
      }
    };

    // Call the function immediately
    handleWelcomeEmail();
  }, [searchParams, firstName, email]);

  // This component doesn't render anything visible
  return null;
}
