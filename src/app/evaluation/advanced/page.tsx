"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizContainer } from "@/components/evaluations/quiz-container";
import { evaluacionAvanzada } from "@/components/evaluations/data/advanced-evaluation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Loader } from "@/components/ui/loader";

export default function AdvancedEvaluation() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        setLoading(true);
        // Check if user is logged in
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error checking auth session:", sessionError);
          setIsLoggedIn(false);
          setIsPremiumUser(false);
          redirectToPricing();
          return;
        }

        if (!session) {
          setIsLoggedIn(false);
          setIsPremiumUser(false);
          redirectToPricing();
          return;
        }

        // User is logged in
        setIsLoggedIn(true);

        // Use a simple approach for now - consider anyone logged in as potentially premium
        // In a production app, you would check subscription status from a reliable source
        setIsPremiumUser(true);
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error checking auth:", error);
        setIsLoggedIn(false);
        setIsPremiumUser(false);
        redirectToPricing();
      }
    }

    function redirectToPricing() {
      setLoading(false);
      router.push("/pricing");
    }

    checkAuthStatus();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  if (!isLoggedIn || !isPremiumUser) {
    // This should not render as we redirect, but have as fallback
    return null;
  }

  return <QuizContainer quizData={evaluacionAvanzada} />;
}
