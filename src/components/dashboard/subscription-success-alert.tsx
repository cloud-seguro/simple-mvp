"use client";

import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function SubscriptionSuccessAlert() {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for subscription_success parameter
    const hasSubscriptionSuccess =
      searchParams.get("subscription_success") === "true";

    if (hasSubscriptionSuccess) {
      setIsVisible(true);

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
          className="mb-6"
        >
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
