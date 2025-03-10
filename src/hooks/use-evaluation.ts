import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizResults } from "@/components/evaluations/types";

interface UseEvaluationProps {
  type: "INITIAL" | "ADVANCED";
  title: string;
  onSuccess?: (evaluationId: string) => void;
  onError?: (error: Error) => void;
}

interface Evaluation {
  id: string;
  type: "INITIAL" | "ADVANCED";
  title: string;
  score: number | null;
  profileId: string;
  answers: Record<string, number>;
  createdAt: string;
  completedAt: string | null;
}

export function useEvaluation({
  type,
  title,
  onSuccess,
  onError,
}: UseEvaluationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submitEvaluation = async (answers: QuizResults) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          answers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit evaluation");
      }

      const data = await response.json();

      if (onSuccess) {
        onSuccess(data.evaluation.id);
      } else {
        // Default behavior: redirect to results page
        router.push(`/evaluation/results/${data.evaluation.id}`);
      }

      return data.evaluation;
    } catch (err) {
      const error = err as Error;
      setError(error.message);

      if (onError) {
        onError(error);
      }

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitEvaluation,
    isSubmitting,
    error,
  };
}

export function useEvaluationHistory() {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEvaluations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch evaluations");
      }

      const data = await response.json();
      setEvaluations(data.evaluations || []);
      return data.evaluations;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchEvaluations,
    evaluations,
    isLoading,
    error,
  };
}
