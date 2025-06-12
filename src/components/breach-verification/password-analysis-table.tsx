"use client";

import { useState } from "react";
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
import type { PasswordAnalysisAPI } from "@/types/breach-verification";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  TriangleAlert,
  XCircle,
} from "lucide-react";

interface PasswordAnalysisTableProps {
  analysis: PasswordAnalysisAPI[];
  showHashes?: boolean;
}

export function PasswordAnalysisTable({
  analysis,
  showHashes = false,
}: PasswordAnalysisTableProps) {
  const [localShowHashes, setLocalShowHashes] = useState(showHashes);

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "fuerte":
        return "secondary";
      case "media":
        return "outline";
      case "débil":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength.toLowerCase()) {
      case "fuerte":
        return Shield;
      case "media":
        return TriangleAlert;
      case "débil":
        return XCircle;
      default:
        return Shield;
    }
  };

  const maskPassword = (password: string): string => {
    if (password.length <= 4) {
      return "*".repeat(password.length);
    }
    return (
      password.substring(0, 2) +
      "*".repeat(password.length - 4) +
      password.substring(password.length - 2)
    );
  };

  const columns: Column<PasswordAnalysisAPI>[] = [
    {
      id: "password",
      header: "Contraseña/Hash",
      cell: ({ row }) => (
        <div className="font-mono text-sm max-w-[200px]">
          {localShowHashes ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help p-2 bg-muted/30 rounded border">
                    <span className="text-xs break-all">
                      {row.passwordHash || maskPassword(row.password)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs break-all">
                    Hash completo: {row.passwordHash || "No disponible"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="p-2 bg-muted/30 rounded border">
              <span className="text-xs">{maskPassword(row.password)}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "occurrences",
      header: "Apariciones",
      cell: ({ row }) => (
        <div className="text-center">
          <Badge
            variant={
              row.occurrences > 100
                ? "destructive"
                : row.occurrences > 10
                  ? "outline"
                  : "secondary"
            }
            className="px-3 py-1"
          >
            {row.occurrences.toLocaleString()}
          </Badge>
        </div>
      ),
    },
    {
      id: "strength",
      header: "Fortaleza",
      cell: ({ row }) => {
        const StrengthIcon = getStrengthIcon(row.strength);
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant={getStrengthColor(row.strength) as any}
                  className="flex items-center gap-1 px-3 py-1 text-sm font-medium cursor-help w-fit"
                >
                  <StrengthIcon className="h-4 w-4" />
                  {row.strength}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Evaluación de la fortaleza de la contraseña basada en
                  longitud, complejidad y patrones comunes
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "recommendation",
      header: "Recomendación",
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {row.recommendation}
          </p>
        </div>
      ),
    },
  ];

  if (analysis.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <Lock className="h-16 w-16 text-green-500 mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-muted-foreground">
            No hay análisis de contraseñas
          </p>
          <p className="text-sm text-muted-foreground">
            No se encontraron contraseñas comprometidas en este análisis
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota de Seguridad:</strong> Los hashes mostrados son
            representaciones cifradas de las contraseñas originales. No se
            almacenan contraseñas en texto plano.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLocalShowHashes(!localShowHashes)}
          className="text-xs"
        >
          {localShowHashes ? (
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

      <DataTable
        title={`Análisis de Contraseñas (${analysis.length})`}
        description="Análisis detallado de contraseñas encontradas en brechas de datos"
        data={analysis}
        columns={columns}
        searchable={true}
        searchField="password"
        defaultSort={{ field: "occurrences", direction: "desc" }}
        rowSelection={false}
        pageSize={10}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
}
