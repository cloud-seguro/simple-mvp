import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
// This is the server-side Stripe instance to be used in API routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil" as Stripe.LatestApiVersion,
  appInfo: {
    name: "BORING Simple MVP",
    version: "1.0.0",
  },
});

// Helper to format amount for Stripe (converts dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper to format amount from Stripe (converts cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
