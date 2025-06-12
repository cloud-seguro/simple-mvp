"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { BreachResultAPI } from "@/types/breach-verification";
import { formatBreachDate } from "@/lib/utils/breach-verification";
import { TriangleAlert, Shield } from "lucide-react";

interface BreachResultsTableProps {
  results: BreachResultAPI[];
}

export function BreachResultsTable({ results }: BreachResultsTableProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
      case "HIGH":
        return TriangleAlert;
      default:
        return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "secondary";
      case "LOW":
      default:
        return "outline";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "Crítica";
      case "HIGH":
        return "Alta";
      case "MEDIUM":
        return "Media";
      case "LOW":
      default:
        return "Baja";
    }
  };

  const columns: Column<BreachResultAPI>[] = [
    {
      id: "breachName",
      header: "Nombre de la Brecha",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium text-foreground">{row.breachName}</p>
          {row.sourceId && (
            <p className="text-xs text-muted-foreground font-mono">
              ID: {row.sourceId}
            </p>
          )}
        </div>
      ),
    },
    {
      id: "breachDate",
      header: "Fecha",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {formatBreachDate(row.breachDate)}
          </p>
          <p className="text-xs text-muted-foreground">
            Verificado: {formatBreachDate(row.verificationDate)}
          </p>
        </div>
      ),
    },
    {
      id: "dataTypes",
      header: "Datos Afectados",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.dataTypes.map((type, index) => (
            <Badge key={index} variant="outline" className="text-xs capitalize">
              {type}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: "severity",
      header: "Severidad",
      cell: ({ row }) => {
        const SeverityIcon = getSeverityIcon(row.severity);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={
                    getSeverityColor(row.severity) as
                      | "destructive"
                      | "secondary"
                      | "outline"
                  }
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium cursor-help w-fit"
                >
                  <SeverityIcon className="h-4 w-4" />
                  {getSeverityLabel(row.severity)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Nivel de severidad basado en el tipo de datos comprometidos y
                  el alcance de la brecha
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "isVerified",
      header: "Estado",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              row.isVerified ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm">
            {row.isVerified ? "Verificado" : "Sin verificar"}
          </span>
        </div>
      ),
    },
    {
      id: "description",
      header: "Descripción",
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {row.description || "No hay descripción disponible"}
          </p>
        </div>
      ),
    },
  ];

  if (results.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <Shield className="h-16 w-16 text-green-500 mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            No se encontraron brechas
          </p>
          <p className="text-sm text-muted-foreground">
            Tu información no aparece en ninguna brecha conocida
          </p>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      title={`Brechas Detectadas (${results.length})`}
      description="Detalles de las brechas de datos encontradas durante el análisis"
      data={results}
      columns={columns}
      searchable={true}
      searchField="breachName"
      defaultSort={{ field: "breachDate", direction: "desc" }}
      rowSelection={false}
      pageSize={10}
      pageSizeOptions={[5, 10, 20]}
    />
  );
}
