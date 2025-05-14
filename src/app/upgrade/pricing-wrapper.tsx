"use client";

import { lazy, Suspense } from "react";
import { StripeProvider } from "@/providers/stripe-provider";

// Use our simplified pricing component to avoid hydration issues
const UpgradePricing = lazy(() => import("./upgrade-pricing"));

// Simple loading component
const LoadingSection = () => (
  <div className="w-full py-20 flex justify-center items-center">
    <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export default function PricingWrapper() {
  return (
    <div className="flex flex-col">
      <StripeProvider>
        <Suspense fallback={<LoadingSection />}>
          <UpgradePricing />
        </Suspense>
      </StripeProvider>
    </div>
  );
}
