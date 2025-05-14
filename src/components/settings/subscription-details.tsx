"use client";

import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useStripe } from "@/providers/stripe-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { UserRole } from "@prisma/client";

export function SubscriptionDetails() {
  const { profile } = useAuth();
  const { openCustomerPortal, isLoading: isStripeLoading } = useStripe();
  const [error, setError] = useState<string | null>(null);

  // Format date to local date string
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Handle opening Stripe Customer Portal
  const handleManageSubscription = async () => {
    try {
      setError(null);
      await openCustomerPortal();
    } catch (error) {
      console.error("Error opening customer portal:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error opening subscription management"
      );
    }
  };

  // Helper to determine if user has an active subscription
  const hasActiveSubscription = !!profile?.stripeSubscriptionId;

  // Helper to check if subscription is in trial period (within 7 days of creation)
  const isInTrialPeriod = () => {
    if (!profile?.stripeCurrentPeriodEnd || !hasActiveSubscription)
      return false;

    const currentPeriodEnd = new Date(profile.stripeCurrentPeriodEnd);
    const now = new Date();

    // If period end is in the future and within 7 days from now, consider it a trial
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return currentPeriodEnd <= sevenDaysFromNow && currentPeriodEnd > now;
  };

  // Get days left until subscription ends
  const getDaysLeft = () => {
    if (!profile?.stripeCurrentPeriodEnd) return 0;

    const currentPeriodEnd = new Date(profile.stripeCurrentPeriodEnd);
    const now = new Date();

    // Calculate days between dates
    const diffTime = currentPeriodEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suscripción</CardTitle>
        <CardDescription>
          Administra tu plan de suscripción y detalles de facturación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Estado</h3>
            <div className="flex items-center">
              {profile?.role === UserRole.PREMIUM ? (
                <>
                  <Badge className="bg-green-500">Activa</Badge>
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                </>
              ) : (
                <>
                  <Badge variant="outline">Plan gratuito</Badge>
                </>
              )}

              {isInTrialPeriod() && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Trial
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Plan</h3>
            <p>{profile?.role === UserRole.PREMIUM ? "Premium" : "Gratuito"}</p>
          </div>

          {hasActiveSubscription && (
            <>
              <div>
                <h3 className="text-sm font-medium mb-1">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Fecha de renovación
                  </div>
                </h3>
                <p>
                  {formatDate(profile?.stripeCurrentPeriodEnd)}
                  {isInTrialPeriod() && (
                    <span className="text-sm text-yellow-600 ml-2">
                      ({getDaysLeft()} días restantes)
                    </span>
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Método de pago
                  </div>
                </h3>
                <p>Tarjeta de crédito</p>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-2 flex items-center text-sm text-red-500">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {profile?.role === UserRole.PREMIUM ? (
          <Button
            onClick={handleManageSubscription}
            disabled={isStripeLoading}
            variant="default"
          >
            {isStripeLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Administrar suscripción
          </Button>
        ) : (
          <Button
            onClick={() => (window.location.href = "/upgrade")}
            variant="default"
          >
            Actualizar a Premium
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
