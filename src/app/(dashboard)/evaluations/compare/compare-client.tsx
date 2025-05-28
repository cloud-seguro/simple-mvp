"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SecurityLoadingScreen } from "@/components/ui/security-loading-screen";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileType,
  ArrowUpDown,
  User,
  Clock,
  RefreshCw,
} from "lucide-react";
import { EvaluationComparison } from "../components/evaluation-comparison";
import { PDFComparisonExport } from "@/components/evaluations/pdf-comparison-export";
import type { UserInfo } from "@/components/evaluations/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EvaluationData {
  id: string;
  title: string;
  createdAt: Date;
  answers: unknown;
  score: number | null;
  type: "INITIAL" | "ADVANCED";
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    company?: string | null;
    company_role?: string | null;
  } | null;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Array<{
    id: string;
    text: string;
    category?: string;
    options: Array<{ value: number }>;
  }>;
}

interface ComparePageClientProps {
  firstEvaluation: EvaluationData;
  secondEvaluation: EvaluationData;
  quizData: QuizData;
  sortOrderLabel: string;
  evaluationType: "INITIAL" | "ADVANCED";
}

export function ComparePageClient({
  firstEvaluation,
  secondEvaluation,
  quizData,
  sortOrderLabel,
  evaluationType,
}: ComparePageClientProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine which evaluations to use based on flip state
  const currentFirst = isFlipped ? secondEvaluation : firstEvaluation;
  const currentSecond = isFlipped ? firstEvaluation : secondEvaluation;

  // Process answers for both evaluations
  const processAnswers = (answers: unknown): Record<string, number> => {
    const result: Record<string, number> = {};

    if (typeof answers === "string") {
      try {
        const parsedAnswers = JSON.parse(answers);
        Object.assign(result, parsedAnswers);
      } catch (e) {
        console.error("Failed to parse answers JSON string:", e);
      }
    } else if (typeof answers === "object" && answers !== null) {
      for (const [key, value] of Object.entries(
        answers as Record<string, unknown>
      )) {
        result[key] = Number(value) || 0;
      }
    }

    return result;
  };

  const firstAnswers = processAnswers(currentFirst.answers);
  const secondAnswers = processAnswers(currentSecond.answers);

  // Prepare user info for both evaluations
  const firstUserInfo: UserInfo = {
    firstName: currentFirst.profile?.firstName || "Usuario",
    lastName: currentFirst.profile?.lastName || "",
    email: currentFirst.profile?.email || "",
  };

  const secondUserInfo: UserInfo = {
    firstName: currentSecond.profile?.firstName || "Usuario",
    lastName: currentSecond.profile?.lastName || "",
    email: currentSecond.profile?.email || "",
  };

  // Format dates and times
  const firstDate = format(currentFirst.createdAt, "d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  const secondDate = format(currentSecond.createdAt, "d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  const firstTime = format(currentFirst.createdAt, "HH:mm", { locale: es });

  const secondTime = format(currentSecond.createdAt, "HH:mm", { locale: es });

  // Determine chronological order for better context
  const firstIsOlder = currentFirst.createdAt < currentSecond.createdAt;

  // Determine if there was improvement between evaluations (chronologically)
  const olderEvaluation = firstIsOlder ? currentFirst : currentSecond;
  const newerEvaluation = firstIsOlder ? currentSecond : currentFirst;

  const isImprovement =
    newerEvaluation.score !== null &&
    olderEvaluation.score !== null &&
    newerEvaluation.score > olderEvaluation.score;

  const improvementPercentage =
    newerEvaluation.score !== null && olderEvaluation.score !== null
      ? Math.round(
          ((newerEvaluation.score - olderEvaluation.score) /
            Math.max(0.1, olderEvaluation.score)) *
            100
        )
      : null;

  // Calculate absolute difference for clearer explanation
  const absoluteDifference =
    newerEvaluation.score !== null && olderEvaluation.score !== null
      ? Math.round(newerEvaluation.score - olderEvaluation.score)
      : null;

  const typeName = evaluationType === "INITIAL" ? "Inicial" : "Avanzada";

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Prepare data for PDF export
  const firstEvaluationData = {
    id: currentFirst.id,
    title: currentFirst.title,
    date: currentFirst.createdAt,
    answers: firstAnswers,
    userInfo: firstUserInfo,
    score: currentFirst.score || 0,
  };

  const secondEvaluationData = {
    id: currentSecond.id,
    title: currentSecond.title,
    date: currentSecond.createdAt,
    answers: secondAnswers,
    userInfo: secondUserInfo,
    score: currentSecond.score || 0,
  };

  return (
    <PDFComparisonExport
      firstEvaluation={firstEvaluationData}
      secondEvaluation={secondEvaluationData}
      quizData={quizData}
      evaluationType={evaluationType}
      renderButtons={(exportButton) => (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleFlip}
            className="gap-2 hover:bg-blue-50 transition-colors"
            title="Intercambiar posiciones de las evaluaciones"
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform ${isFlipped ? "rotate-180" : ""}`}
            />
            Intercambiar
          </Button>
          {exportButton}
        </div>
      )}
    >
      <div className="container py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Link href="/evaluations">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">
                Comparación de Evaluaciones
              </h1>
              <Badge variant="outline" className="ml-2 gap-1">
                <FileType className="h-3 w-3 mr-1" />
                Evaluación {typeName}
              </Badge>
            </div>
            {/* Buttons are now rendered by PDFComparisonExport */}
          </div>

          {/* Flip Status Indicator */}
          {isFlipped && (
            <div className="mb-4">
              <Badge
                variant="secondary"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                🔄 Vista intercambiada: Las posiciones de las evaluaciones han
                sido invertidas
              </Badge>
            </div>
          )}

          {/* Evaluation Headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-semibold">
                    Evaluación 1
                  </span>
                  <span className="text-base">{currentFirst.title}</span>
                  {isFlipped && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-50 text-blue-600"
                    >
                      (Originalmente 2ª)
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Primera evaluación en la comparación actual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{firstDate}</span>
                  <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                  <span>{firstTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {firstUserInfo.firstName} {firstUserInfo.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Puntuación:
                  </span>
                  <Badge
                    className={
                      currentFirst.score && currentFirst.score >= 70
                        ? "bg-green-100 text-green-800"
                        : currentFirst.score && currentFirst.score >= 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                    variant="secondary"
                  >
                    {Math.round(currentFirst.score || 0)}%
                  </Badge>
                </div>
                {firstIsOlder && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    📅 Evaluación más antigua
                  </Badge>
                )}
                {!firstIsOlder && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    🕒 Evaluación más reciente
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-semibold">
                    Evaluación 2
                  </span>
                  <span className="text-base">{currentSecond.title}</span>
                  {isFlipped && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-600"
                    >
                      (Originalmente 1ª)
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Segunda evaluación en la comparación actual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{secondDate}</span>
                  <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                  <span>{secondTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {secondUserInfo.firstName} {secondUserInfo.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Puntuación:
                  </span>
                  <Badge
                    className={
                      currentSecond.score && currentSecond.score >= 70
                        ? "bg-green-100 text-green-800"
                        : currentSecond.score && currentSecond.score >= 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }
                    variant="secondary"
                  >
                    {Math.round(currentSecond.score || 0)}%
                  </Badge>
                </div>
                {!firstIsOlder && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    📅 Evaluación más antigua
                  </Badge>
                )}
                {firstIsOlder && (
                  <Badge variant="outline" className="text-xs bg-gray-50">
                    🕒 Evaluación más reciente
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comparison Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Resumen de la Comparación</span>
                {isFlipped && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-orange-50 text-orange-700"
                  >
                    🔄 Vista Intercambiada
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  <span>Orden seleccionado: {sortOrderLabel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Comparando evaluaciones entre {firstDate} y {secondDate}
                  </span>
                </div>
                {improvementPercentage !== null &&
                  absoluteDifference !== null && (
                    <div className="bg-muted p-4 rounded-md mt-3">
                      <p
                        className={`font-medium text-base ${isImprovement ? "text-green-600" : "text-red-600"}`}
                      >
                        {isImprovement
                          ? `📈 Mejora entre las evaluaciones: subió ${absoluteDifference} puntos (de ${Math.round(olderEvaluation.score || 0)}% a ${Math.round(newerEvaluation.score || 0)}%)`
                          : `📉 Disminución entre las evaluaciones: bajó ${Math.abs(absoluteDifference)} puntos (de ${Math.round(olderEvaluation.score || 0)}% a ${Math.round(newerEvaluation.score || 0)}%)`}
                      </p>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {Math.abs(improvementPercentage) > 0 && (
                          <span>
                            Esto representa un cambio del{" "}
                            {Math.abs(improvementPercentage)}%{" "}
                            {isImprovement ? "hacia arriba" : "hacia abajo"}{" "}
                            respecto a la puntuación inicial.
                          </span>
                        )}
                      </p>
                      <p className="text-sm mt-2">
                        {isImprovement
                          ? "Las medidas implementadas han mejorado el nivel de seguridad de tu organización."
                          : "Se recomienda revisar las medidas de seguridad implementadas y identificar áreas de oportunidad."}
                      </p>
                      {isFlipped && (
                        <p className="text-xs mt-2 text-blue-600">
                          ℹ️ Esta interpretación refleja la vista intercambiada
                          actual.
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Suspense
          fallback={
            <SecurityLoadingScreen message="Cargando comparación detallada..." />
          }
        >
          <EvaluationComparison
            quizData={quizData}
            firstEvaluation={{
              id: currentFirst.id,
              title: "Evaluación 1",
              date: currentFirst.createdAt,
              answers: firstAnswers,
              userInfo: firstUserInfo,
              score: currentFirst.score || 0,
            }}
            secondEvaluation={{
              id: currentSecond.id,
              title: "Evaluación 2",
              date: currentSecond.createdAt,
              answers: secondAnswers,
              userInfo: secondUserInfo,
              score: currentSecond.score || 0,
            }}
            evaluationType={evaluationType}
          />
        </Suspense>
      </div>
    </PDFComparisonExport>
  );
}
