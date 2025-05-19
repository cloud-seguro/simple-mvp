"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti, ConfettiRef } from "@/components/magicui/confetti";

export function SubscriptionSuccessAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    // Check for subscription_success parameter
    const hasSubscriptionSuccess =
      searchParams.get("subscription_success") === "true";

    if (hasSubscriptionSuccess) {
      setIsVisible(true);

      // Create a more impressive confetti celebration
      // First burst - from top center
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.1, x: 0.5 },
          colors: [
            "#4ade80",
            "#22c55e",
            "#16a34a",
            "#15803d",
            "#facc15",
            "#eab308",
          ],
          startVelocity: 30,
          gravity: 1.2,
          shapes: ["circle", "square"],
        });
      }, 300);

      // Second burst - from left
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5, x: 0.1 },
          colors: ["#60a5fa", "#3b82f6", "#2563eb", "#facc15", "#eab308"],
          startVelocity: 25,
        });
      }, 600);

      // Third burst - from right
      setTimeout(() => {
        confettiRef.current?.fire({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5, x: 0.9 },
          colors: ["#f87171", "#ef4444", "#dc2626", "#facc15", "#eab308"],
          startVelocity: 25,
        });
      }, 900);

      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 relative"
        >
          {/* Confetti canvas positioned absolutely */}
          <Confetti
            ref={confettiRef}
            manualstart={true}
            className="fixed inset-0 pointer-events-none z-50"
          />

          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex justify-between w-full items-center">
              <div>
                <AlertTitle className="text-green-800 font-medium">
                  ¡Suscripción activada con éxito!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Tu cuenta ha sido actualizada a PREMIUM. Ahora tienes acceso a
                  todas las funcionalidades.
                </AlertDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsVisible(false)}
                className="text-green-700 hover:bg-green-100 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
