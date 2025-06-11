"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Shield,
  ArrowLeft,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  Mail,
  Globe,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { BreachResultsTable } from "@/components/breach-verification/breach-results-table";
import { PasswordAnalysisTable } from "@/components/breach-verification/password-analysis-table";
import { RiskLevel, BreachSearchType } from "@prisma/client";
import type {
  BreachSearchRequest,
  BreachResultAPI,
  PasswordAnalysisAPI,
} from "@/types/breach-verification";

interface DetailedAnalysisPageProps {
  params: Promise<{
    requestId: string;
  }>;
}

interface DetailedBreachData extends BreachSearchRequest {
  results: BreachResultAPI[];
  passwordAnalysis: PasswordAnalysisAPI[];
}

export default function DetailedAnalysisPage({
  params,
}: DetailedAnalysisPageProps) {
  const router = useRouter();
  const [showPasswordHashes, setShowPasswordHashes] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  // Resolve the params Promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRequestId(resolvedParams.requestId);
    };
    resolveParams();
  }, [params]);

  // Fetch detailed breach data
  const {
    data: breachData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["breach-details", requestId],
    queryFn: async (): Promise<DetailedBreachData> => {
      if (!requestId) throw new Error("Request ID not available");

      const response = await fetch(`/api/breach-verification/${requestId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch breach details");
      }

      const result = await response.json();
      return {
        ...result.data,
        createdAt: new Date(result.data.createdAt),
        completedAt: result.data.completedAt
          ? new Date(result.data.completedAt)
          : null,
        results: result.data.results || [],
      };
    },
    enabled: !!requestId, // Only run query when requestId is available
  });

  const getRiskLevelDisplay = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.HIGH:
      case RiskLevel.CRITICAL:
        return { level: "Alto", color: "destructive", icon: XCircle };
      case RiskLevel.MEDIUM:
        return { level: "Medio", color: "yellow", icon: AlertTriangle };
      case RiskLevel.LOW:
        return { level: "Bajo", color: "green", icon: CheckCircle };
      default:
        return { level: "Bajo", color: "green", icon: CheckCircle };
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getSearchTypeDisplay = (type: BreachSearchType) => {
    return type === BreachSearchType.EMAIL
      ? { label: "Correo Electrónico", icon: Mail }
      : { label: "Dominio", icon: Globe };
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download functionality
    console.log("Downloading PDF report for request:", requestId);
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("Exporting CSV for request:", requestId);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !breachData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-destructive">
          <CardContent className="p-8 text-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                Error al cargar el análisis
              </h2>
              <p className="text-muted-foreground">
                {error?.message ||
                  "No se pudo cargar la información del análisis de brecha"}
              </p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskData = getRiskLevelDisplay(breachData.riskLevel || RiskLevel.LOW);
  const searchTypeData = getSearchTypeDisplay(breachData.type);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  Análisis Detallado de Brecha
                </h1>
                <p className="text-muted-foreground text-lg">
                  Reporte completo de verificación de seguridad
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Search Summary */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Resumen de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Tipo de Búsqueda
              </p>
              <div className="flex items-center gap-2">
                <searchTypeData.icon className="h-4 w-4 text-primary" />
                <span className="font-semibold">{searchTypeData.label}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Valor Buscado
              </p>
              <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {breachData.searchValue}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Nivel de Riesgo
              </p>
              <Badge
                variant={
                  riskData.color === "destructive"
                    ? "destructive"
                    : riskData.color === "green"
                      ? "secondary"
                      : "outline"
                }
                className="flex items-center gap-2 w-fit"
              >
                <riskData.icon className="h-4 w-4" />
                Riesgo {riskData.level}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Brechas Encontradas
              </p>
              <p className="text-2xl font-bold text-primary">
                {breachData.totalBreaches || 0}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Fecha de Búsqueda
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(breachData.createdAt)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Fecha de Finalización
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(breachData.completedAt || null)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Análisis de Riesgo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-background to-muted/20 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Estado de Seguridad: {riskData.level}
                </h3>
                <p className="text-muted-foreground">
                  {breachData.totalBreaches === 0
                    ? "No se encontraron brechas de datos para este término de búsqueda."
                    : `Se identificaron ${breachData.totalBreaches} brecha(s) que afectan tu información.`}
                </p>
              </div>
              <div className="text-center">
                <riskData.icon className="h-16 w-16 mx-auto mb-2" />
                <Badge
                  variant={
                    riskData.color === "destructive"
                      ? "destructive"
                      : riskData.color === "green"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-lg px-4 py-2"
                >
                  {riskData.level}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breach Results */}
      {breachData.results && breachData.results.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle>
              Brechas Detectadas ({breachData.results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BreachResultsTable results={breachData.results} />
          </CardContent>
        </Card>
      )}

      {/* Password Analysis */}
      {breachData.passwordAnalysis &&
        breachData.passwordAnalysis.length > 0 && (
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Análisis de Contraseñas ({breachData.passwordAnalysis.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordHashes(!showPasswordHashes)}
                  className="text-xs"
                >
                  {showPasswordHashes ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Ocultar Hashes
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Mostrar Hashes
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Nota de Seguridad:</strong> Los hashes mostrados son
                  representaciones cifradas de las contraseñas originales. No se
                  almacenan contraseñas en texto plano.
                </p>
              </div>
              <PasswordAnalysisTable
                analysis={breachData.passwordAnalysis}
                showHashes={showPasswordHashes}
              />
            </CardContent>
          </Card>
        )}

      {/* No Results Message */}
      {breachData.totalBreaches === 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-green-800">
                ¡Excelente! No se encontraron brechas
              </h2>
              <p className="text-green-700">
                Tu{" "}
                {breachData.type === BreachSearchType.EMAIL
                  ? "correo electrónico"
                  : "dominio"}{" "}
                <strong>{breachData.searchValue}</strong> no aparece en nuestra
                base de datos de brechas conocidas.
              </p>
              <p className="text-sm text-green-600">
                Esto significa que, hasta donde sabemos, tu información no ha
                sido comprometida en violaciones de datos públicamente
                conocidas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
