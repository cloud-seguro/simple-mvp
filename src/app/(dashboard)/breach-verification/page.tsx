"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Search,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BreachResultsTable } from "@/components/breach-verification/breach-results-table";
import { PasswordAnalysisTable } from "@/components/breach-verification/password-analysis-table";
import { SearchHistoryTable } from "@/components/breach-verification/search-history-table";
import {
  useBreachVerification,
  useBreachSearchForm,
} from "@/hooks/use-breach-verification";
import { validateEmail, validateDomain } from "@/lib/utils/breach-verification";
import { RiskLevel } from "@/types/breach-verification";

export default function BreachVerificationPage() {
  const {
    performSearch,
    isSearching,
    searchError,
    searchResults,
    isSearchSuccess,
    searchHistory,
    clearValidationError,
    resetSearch,
  } = useBreachVerification();

  const {
    searchType,
    setSearchType,
    searchValue,
    setSearchValue,
    hasSearched,
    clearForm,
    markAsSearched,
  } = useBreachSearchForm();

  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    clearValidationError();

    // Validate input
    if (searchType === "EMAIL" && !validateEmail(searchValue)) {
      setValidationError("Por favor ingresa un correo electrónico válido");
      return;
    }

    if (searchType === "DOMAIN" && !validateDomain(searchValue)) {
      setValidationError("Por favor ingresa un dominio válido");
      return;
    }

    try {
      await performSearch({
        type: searchType as "EMAIL" | "DOMAIN",
        searchValue,
      });
      markAsSearched();
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleClearInput = () => {
    clearForm();
    resetSearch();
    setValidationError("");
    clearValidationError();
  };

  const handleSearchAgain = (type: string, value: string) => {
    setSearchType(type === "email" ? "EMAIL" : "DOMAIN");
    setSearchValue(value);
    clearForm();
    resetSearch();
    setValidationError("");
    clearValidationError();

    // Auto-scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const handleDownloadPDF = () => {
    // Placeholder for PDF download functionality
    console.log("Downloading PDF...");
  };

  const handleExportCSV = () => {
    // Placeholder for CSV export functionality
    console.log("Exporting CSV...");
  };

  const currentError = validationError || searchError;
  const riskData = searchResults?.riskLevel
    ? getRiskLevelDisplay(searchResults.riskLevel)
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">SIMPLE BREACH</h1>
            <p className="text-muted-foreground text-lg">
              Verifica si tu correo o dominio ha sido expuesto en brechas de
              datos
            </p>
          </div>
        </div>

        {/* Subtitle and description */}
        <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta herramienta te permite verificar si tu información personal ha
            sido comprometida en violaciones de datos conocidas. Ingresa tu
            correo electrónico o dominio para realizar una búsqueda exhaustiva
            en nuestra base de datos de brechas.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-2 shadow-lg">
        <div className="p-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold">Verificador de Brechas</h2>
            <p className="text-muted-foreground">
              {isSearchSuccess
                ? "Resultados encontrados. Puedes realizar una nueva búsqueda o limpiar los campos."
                : "Busca exposiciones de datos en correos electrónicos o dominios"}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="search-type" className="text-base font-medium">
                  Buscar por:
                </Label>
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecciona tipo de búsqueda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMAIL">📧 Correo Electrónico</SelectItem>
                    <SelectItem value="DOMAIN">🌐 Dominio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="search-value" className="text-base font-medium">
                  {searchType === "EMAIL"
                    ? "Correo a buscar:"
                    : "Dominio a buscar:"}
                </Label>
                <div className="relative">
                  <Input
                    id="search-value"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      searchType === "EMAIL"
                        ? "ejemplo@correo.com"
                        : "ejemplo.com"
                    }
                    className={`h-12 text-base pr-12 ${currentError ? "border-destructive" : ""}`}
                    required
                  />
                  {searchValue && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearInput}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                      title="Limpiar campo"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {currentError && (
                  <p className="text-sm text-destructive font-medium">
                    {currentError}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                type="submit"
                disabled={isSearching || !searchValue}
                size="lg"
                className="px-8 py-3 text-base font-medium min-w-[160px]"
              >
                <Search className="h-5 w-5 mr-2" />
                {isSearching
                  ? "Buscando..."
                  : hasSearched
                    ? "Buscar Nuevamente"
                    : "Iniciar Búsqueda"}
              </Button>

              {searchValue && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearInput}
                  size="lg"
                  className="px-6 py-3 text-base"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Limpiar Búsqueda
                </Button>
              )}

              {isSearchSuccess && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadPDF}
                    size="lg"
                    className="px-6 py-3 text-base"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Descargar PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleExportCSV}
                    size="lg"
                    className="px-6 py-3 text-base"
                  >
                    <FileSpreadsheet className="h-5 w-5 mr-2" />
                    Exportar CSV
                  </Button>
                </>
              )}
            </div>
          </form>

          {/* Loading Indicator */}
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground text-lg font-medium">
                  Contactando servidor...
                </p>
                <p className="text-sm text-muted-foreground">
                  Analizando bases de datos de brechas
                </p>
              </div>
            </div>
          )}

          {/* Results Area */}
          {isSearchSuccess && !isSearching && searchResults && (
            <div className="space-y-8">
              {/* Summary */}
              <Card className="border-2 bg-gradient-to-r from-background to-muted/20">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">
                        Se encontraron {searchResults.breachCount || 0} brechas
                        para:
                      </p>
                      <p className="text-muted-foreground font-mono text-sm">
                        {searchValue}
                      </p>
                    </div>
                    {riskData && (
                      <Badge
                        variant={
                          riskData.color === "destructive"
                            ? "destructive"
                            : riskData.color === "green"
                              ? "secondary"
                              : "outline"
                        }
                        className="flex items-center gap-2 px-4 py-2 text-base"
                      >
                        <riskData.icon className="h-4 w-4" />
                        Riesgo {riskData.level}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>

              {/* Results Table */}
              {searchResults.results && searchResults.results.length > 0 && (
                <div className="space-y-4">
                  <BreachResultsTable results={searchResults.results} />
                </div>
              )}

              {/* Password Analysis Section */}
              {searchResults.passwordAnalysis &&
                searchResults.passwordAnalysis.length > 0 && (
                  <div className="space-y-4">
                    <PasswordAnalysisTable
                      analysis={searchResults.passwordAnalysis}
                    />
                  </div>
                )}
            </div>
          )}
        </div>
      </Card>

      {/* Search History */}
      <SearchHistoryTable
        history={searchHistory}
        onSearchAgain={handleSearchAgain}
        onClearHistory={() => {}}
      />
    </div>
  );
}
