"use client";

import { CybersecurityResults } from "@/components/evaluations/cybersecurity-results";
import { PDFExport } from "@/components/evaluations/pdf-export";
import type { QuizData, UserInfo } from "@/components/evaluations/types";

interface EvaluationContentProps {
  evaluationId: string;
  evaluation: any; // Replace with proper type
  quizData: QuizData;
  answers: Record<string, number>;
  userInfo: UserInfo;
}

export function EvaluationContent({
  evaluationId,
  evaluation,
  quizData,
  answers,
  userInfo,
}: EvaluationContentProps) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <PDFExport evaluationId={evaluationId}>
          <CybersecurityResults
            quizData={quizData}
            results={answers}
            userInfo={userInfo}
            isSharedView={false}
          />
        </PDFExport>
      </div>
      <CybersecurityResults
        quizData={quizData}
        results={answers}
        userInfo={userInfo}
        isSharedView={false}
      />
    </>
  );
}
