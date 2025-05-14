"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStripe } from "@/providers/stripe-provider";
import { Loader2 } from "lucide-react";

interface SubscriptionButtonProps {
  priceId?: string; // Optional - will use env variable default if not provided
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

/**
 * A button component that initiates a Stripe checkout session for subscriptions
 */
export function SubscriptionButton({
  priceId,
  children,
  variant = "default",
  className,
}: SubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createCheckoutSession } = useStripe();

  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(
        "Starting subscription process with price ID:",
        priceId || "default from env"
      );

      // Use the priceId or default from environment variable
      await createCheckoutSession(priceId);
    } catch (error: any) {
      console.error("Error handling subscription:", error);
      setError(
        error.message || "An error occurred while processing your subscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        variant={variant}
        className={className}
        onClick={handleSubscription}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {children}
      </Button>
      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
