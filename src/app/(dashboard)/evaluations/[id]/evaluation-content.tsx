"use client";

import { CybersecurityResults } from "@/components/evaluations/cybersecurity-results";
import { PDFExport } from "@/components/evaluations/pdf-export";
import type { QuizData, UserInfo } from "@/components/evaluations/types";

interface EvaluationData {
  id: string;
  score: number;
  maxScore: number;
  maturityDescription: string;
  maturityLevelNumber: number;
  weakestCategories: string[];
  recommendations: Array<{
    score: number;
    maxScore: number;
    text: string;
    selectedOption: string;
    category: string;
    recommendation: string;
  }>;
  categories: Array<{
    name: string;
    score: number;
    maxScore: number;
  }>;
}

interface EvaluationContentProps {
  evaluation: any; // Using any temporarily for the evaluation object
  quizData: QuizData;
  answers: Record<string, number>;
  userInfo: UserInfo;
  evaluationData: EvaluationData;
}

export function EvaluationContent({
  evaluation,
  quizData,
  answers,
  userInfo,
  evaluationData,
}: EvaluationContentProps) {
  const id = evaluation.id;

  return (
    <PDFExport evaluationId={id}>
      <CybersecurityResults
        score={evaluationData.score}
        maxScore={evaluationData.maxScore}
        maturityDescription={evaluationData.maturityDescription}
        maturityLevelNumber={evaluationData.maturityLevelNumber}
        weakestCategories={evaluationData.weakestCategories}
        categories={evaluationData.categories}
        recommendations={evaluationData.recommendations}
        quizData={quizData}
        results={answers}
        userInfo={userInfo}
        isSharedView={false}
      />
    </PDFExport>
  );
}
