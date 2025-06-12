"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { SearchHistory } from "@/types/breach-verification";
import {
  History,
  Trash2,
  Eye,
  RefreshCw,
  Clock,
  TriangleAlert,
  CheckCircle,
  XCircle,
  Mail,
  Globe,
} from "lucide-react";
import { RiskLevel, BreachSearchType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      return "secondary";
    case RiskLevel.LOW:
      return "outline";
    default:
      return "outline";
  }
}

function getRiskLevelLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.HIGH:
    case RiskLevel.CRITICAL:
      return "Alto";
    case RiskLevel.MEDIUM:
      return "Medio";
    case RiskLevel.LOW:
      return "Bajo";
    default:
      return "Bajo";
  }
}

function getRiskLevelIcon(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case RiskLevel.HIGH:
    case RiskLevel.CRITICAL:
      return XCircle;
    case RiskLevel.MEDIUM:
      return TriangleAlert;
    case RiskLevel.LOW:
      return CheckCircle;
    default:
      return CheckCircle;
  }
}

function getSearchTypeIcon(searchType: BreachSearchType) {
  return searchType === BreachSearchType.EMAIL ? Mail : Globe;
}

export function SearchHistoryTable({
  history,
  onSearchAgain,
  onClearHistory,
}: SearchHistoryTableProps) {
  const router = useRouter();
  const [isClearingHistory, setIsClearingHistory] = useState(false);

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
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

  const getRelativeTime = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      const now = new Date();
      const diffInHours = Math.floor(
        (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)
      );

      if (diffInHours < 1) return "Hace menos de 1 hora";
      if (diffInHours < 24)
        return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7)
        return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`;

      return formatDate(dateObj);
    } catch {
      return "Fecha inválida";
    }
  };

  const handleViewDetails = (requestId: string) => {
    router.push(`/breach-verification/${requestId}`);
  };

  const handleClearHistory = async () => {
    setIsClearingHistory(true);
    try {
      await onClearHistory();
    } finally {
      setIsClearingHistory(false);
    }
  };

  const columns: Column<SearchHistory>[] = [
    {
      id: "type",
      header: "Tipo",
      cell: ({ row }) => {
        const TypeIcon = getSearchTypeIcon(row.searchType);
        return (
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {row.searchType === BreachSearchType.EMAIL ? "Email" : "Dominio"}
            </span>
          </div>
        );
      },
    },
    {
      id: "searchValue",
      header: "Término Buscado",
      cell: ({ row }) => (
        <div className="font-mono text-sm bg-muted/30 px-2 py-1 rounded max-w-[200px] truncate">
          {row.searchValue}
        </div>
      ),
    },
    {
      id: "timestamp",
      header: "Fecha",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{formatDate(row.timestamp)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {getRelativeTime(row.timestamp)}
          </p>
        </div>
      ),
    },
    {
      id: "totalBreaches",
      header: "Brechas",
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            variant={row.breachCount > 0 ? "destructive" : "secondary"}
            className="px-3 py-1"
          >
            {row.breachCount}
          </Badge>
        </div>
      ),
    },
    {
      id: "riskLevel",
      header: "Riesgo",
      cell: ({ row }) => {
        const RiskIcon = getRiskLevelIcon(row.riskLevel);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={
                    getRiskLevelColor(row.riskLevel) as
                      | "destructive"
                      | "secondary"
                      | "outline"
                  }
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium cursor-help w-fit"
                >
                  <RiskIcon className="h-4 w-4" />
                  {getRiskLevelLabel(row.riskLevel)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nivel de riesgo basado en las brechas encontradas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(row.requestId)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalles del análisis</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onSearchAgain(
                      row.searchType === BreachSearchType.EMAIL ? "email" : "domain",
                      row.searchValue
                    )
                  }
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Repetir búsqueda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  if (history.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="relative">
          <History className="h-16 w-16 text-muted-foreground mx-auto" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">0</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            No hay búsquedas previas
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Realiza tu primera búsqueda de brechas para ver el historial aquí.
            Podrás revisar, repetir y comparar tus análisis anteriores.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Los resultados se guardarán automáticamente</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div></div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={isClearingHistory}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Historial
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ¿Limpiar historial de búsquedas?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente todo el historial de
                búsquedas. No podrás deshacer esta acción.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearHistory}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <DataTable
        title={`Historial de Búsquedas (${history.length})`}
        description="Historial completo de búsquedas de brechas realizadas"
        data={history}
        columns={columns}
        searchable={true}
        searchField="searchValue"
        defaultSort={{ field: "timestamp", direction: "desc" }}
        rowSelection={false}
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
        onRowClick={(row) => handleViewDetails(row.requestId)}
      />
    </div>
  );
}
