"use client";

import { useEffect, useState } from "react";
import { CybersecurityResults } from "@/components/evaluations/cybersecurity-results";
import { PDFExport } from "@/components/evaluations/pdf-export";
import { Loader } from "@/components/ui/loader";
import type { QuizData, UserInfo } from "@/components/evaluations/types";

interface EvaluationData {
  id: string;
  score: number;
  maxScore: number;
  maturityLevel: string;
  maturityDescription: string;
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
  }>;
}

interface EvaluationContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluation: any; // Using any temporarily for the evaluation object
  quizData: QuizData;
  answers: Record<string, number>;
  userInfo: UserInfo;
}

export function EvaluationContent({
  evaluation,
  quizData,
  answers,
  userInfo,
}: EvaluationContentProps) {
  const [data, setData] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = evaluation.id; // Get the ID from the evaluation object

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const response = await fetch(`/api/evaluations/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch evaluation");
        }
        const evaluationData: EvaluationData = await response.json();
        setData(evaluationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader size="lg" variant="primary" />
        <p className="text-muted-foreground">Cargando evaluación...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <PDFExport evaluationId={id}>
      <CybersecurityResults
        evaluationId={id}
        score={data.score}
        maxScore={data.maxScore}
        maturityLevel={data.maturityLevel}
        maturityDescription={data.maturityDescription}
        categories={data.categories}
        quizData={quizData}
        results={answers}
        userInfo={userInfo}
        onRestart={() => {}}
        isSharedView={false}
      />
    </PDFExport>
  );
}
