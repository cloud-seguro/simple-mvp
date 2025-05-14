"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Initialize Stripe on the client side
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormWrapperProps {
  clientSecret: string;
  returnUrl: string;
  amount: number;
  children: React.ReactNode;
}

/**
 * Wrapper component that provides a properly configured Elements provider
 */
export function PaymentFormWrapper({
  clientSecret,
  returnUrl,
  amount,
  children,
}: PaymentFormWrapperProps) {
  // Configure Elements with the correct amount
  const options = {
    clientSecret,
    mode: "payment" as const,
    currency: "usd",
    amount: Math.round(amount * 100), // Convert dollars to cents
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

interface PaymentFormProps {
  clientSecret: string;
  returnUrl: string;
  amount: number;
}

/**
 * A complete payment form component using Stripe Elements
 */
export default function PaymentForm({
  clientSecret,
  returnUrl,
  amount,
}: PaymentFormProps) {
  // For direct usage, wrap with our own Elements provider
  if (!clientSecret) {
    return <div>Missing payment information</div>;
  }

  return (
    <PaymentFormWrapper
      clientSecret={clientSecret}
      returnUrl={returnUrl}
      amount={amount}
    >
      <PaymentFormContent returnUrl={returnUrl} amount={amount} />
    </PaymentFormWrapper>
  );
}

interface PaymentFormContentProps {
  returnUrl: string;
  amount?: number;
}

/**
 * The actual payment form content (to be used within Elements context)
 */
function PaymentFormContent({ returnUrl, amount }: PaymentFormContentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      console.error("Payment confirmation error:", error);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {amount && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <div className="flex justify-between items-center">
            <span>Total:</span>
            <span className="text-lg font-medium">${amount.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <PaymentElement />

        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">Billing Address</h3>
          <AddressElement options={{ mode: "billing" }} />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full py-6"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${amount ? `$${amount.toFixed(2)}` : ""}`
        )}
      </Button>
    </form>
  );
}
