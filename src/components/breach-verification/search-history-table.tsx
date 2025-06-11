"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SearchHistory } from "@/types/breach-verification";
import { History, Search, Trash2, Eye } from "lucide-react";
import { RiskLevel, BreachSearchType } from "@prisma/client";
import { useRouter } from "next/navigation";

interface SearchHistoryTableProps {
  history: SearchHistory[];
  onSearchAgain: (searchType: string, searchValue: string) => void;
  onClearHistory: () => void;
}

function getRiskLevelColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.HIGH:
    case RiskLevel.CRITICAL:
      return "destructive";
    case RiskLevel.MEDIUM:
      return "yellow";
    case RiskLevel.LOW:
      return "green";
    default:
      return "secondary";
  }
}

function getRiskLevelLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.HIGH:
      return "Alto";
    case RiskLevel.CRITICAL:
      return "Crítico";
    case RiskLevel.MEDIUM:
      return "Medio";
    case RiskLevel.LOW:
      return "Bajo";
    default:
      return "Desconocido";
  }
}

function getSearchTypeLabel(searchType: BreachSearchType): string {
  return searchType === BreachSearchType.EMAIL ? "📧 Email" : "🌐 Dominio";
}

export function SearchHistoryTable({
  history,
  onSearchAgain,
  onClearHistory,
}: SearchHistoryTableProps) {
  const router = useRouter();

  const formatDate = (date: Date | string) => {
    try {
      // Ensure we have a valid Date object
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        return "Fecha inválida";
      }

      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "Fecha inválida";
    }
  };

  const handleViewDetails = (requestId: string) => {
    router.push(`/breach-verification/${requestId}`);
  };

  if (history.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            📜 Historial de Búsquedas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <History className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                No hay búsquedas previas
              </p>
              <p className="text-sm text-muted-foreground">
                Realiza tu primera búsqueda para ver el historial aquí
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            📜 Historial de Búsquedas ({history.length})
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearHistory}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-4 font-semibold text-base">
                  Tipo
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Búsqueda
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Brechas
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Riesgo
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Fecha
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="p-4">
                    <Badge variant="outline" className="text-xs">
                      {getSearchTypeLabel(item.searchType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 font-mono text-sm break-all max-w-[250px]">
                    {item.searchValue}
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="font-semibold text-lg">
                      {item.breachCount}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={getRiskLevelColor(item.riskLevel) as any}
                      className="px-3 py-1 text-sm"
                    >
                      {getRiskLevelLabel(item.riskLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-sm text-muted-foreground">
                    {formatDate(item.timestamp)}
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(item.requestId)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalles
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onSearchAgain(
                            item.searchType === BreachSearchType.EMAIL
                              ? "email"
                              : "domain",
                            item.searchValue
                          )
                        }
                        className="text-xs"
                      >
                        <Search className="h-3 w-3 mr-1" />
                        Repetir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
