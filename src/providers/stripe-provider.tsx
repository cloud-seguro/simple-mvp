"use client";

import React, { createContext, useContext, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";

// Initialize Stripe on the client side
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Default subscription price ID from environment variable
const DEFAULT_PRICE_ID =
  process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID;

// Stripe Context types
type StripeContextType = {
  isLoading: boolean;
  createCheckoutSession: (priceId?: string) => Promise<void>;
  createSubscription: (priceId?: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;
};

// Create Stripe Context with default values
const StripeContext = createContext<StripeContextType>({
  isLoading: false,
  createCheckoutSession: async () => {},
  createSubscription: async () => {},
  openCustomerPortal: async () => {},
});

// Custom hook to use Stripe Context
export const useStripe = () => useContext(StripeContext);

// Props type for Stripe Provider
type StripeProviderProps = {
  children: React.ReactNode;
};

/**
 * Stripe Provider Component
 * Provides Stripe context and Elements wrapper for payment components
 */
export function StripeProvider({ children }: StripeProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Create a checkout session and redirect to Stripe Checkout
  const createCheckoutSession = async (priceId?: string) => {
    try {
      const actualPriceId = priceId || DEFAULT_PRICE_ID;
      console.log("Creating checkout session with price ID:", actualPriceId);
      setIsLoading(true);

      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: actualPriceId }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response from server:", responseData);
        throw new Error(
          responseData.error || "Failed to create checkout session"
        );
      }

      console.log("Checkout session created:", responseData);

      if (responseData.url) {
        window.location.href = responseData.url;
      } else {
        throw new Error("No redirect URL returned from server");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a subscription using the Payment Element
  const createSubscription = async (priceId?: string) => {
    try {
      const actualPriceId = priceId || DEFAULT_PRICE_ID;
      console.log("Creating subscription with price ID:", actualPriceId);
      setIsLoading(true);

      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: actualPriceId }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response from server:", responseData);
        throw new Error(responseData.error || "Failed to create subscription");
      }

      console.log("Subscription created:", responseData);

      if (responseData.url) {
        window.location.href = responseData.url;
      } else {
        throw new Error("No redirect URL returned from server");
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Open Stripe Customer Portal for subscription management
  const openCustomerPortal = async () => {
    try {
      console.log("Opening customer portal");
      setIsLoading(true);

      const response = await fetch("/api/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error response from server:", responseData);
        throw new Error(responseData.error || "Failed to open customer portal");
      }

      console.log("Customer portal session created:", responseData);

      if (responseData.url) {
        window.location.href = responseData.url;
      } else {
        throw new Error("No redirect URL returned from server");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Default Stripe Elements options
  const options: StripeElementsOptions = {
    mode: "setup",
    currency: "usd",
    appearance: {
      theme: "stripe",
    },
  };

  const value = {
    isLoading,
    createCheckoutSession,
    createSubscription,
    openCustomerPortal,
  };

  return (
    <StripeContext.Provider value={value}>
      <Elements stripe={stripePromise} options={options}>
        {children}
      </Elements>
    </StripeContext.Provider>
  );
}
