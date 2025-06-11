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
import type { BreachResultAPI } from "@/types/breach-verification";
import { formatBreachDate } from "@/lib/utils/breach-verification";

interface BreachResultsTableProps {
  results: BreachResultAPI[];
}

export function BreachResultsTable({ results }: BreachResultsTableProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          📊 Resultados de Brechas de Datos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-4 font-semibold text-base">
                  Nombre de la Brecha
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Fecha
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Datos Afectados
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Severidad
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Estado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow
                  key={result.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="p-4 font-medium">
                    {result.breachName}
                  </TableCell>
                  <TableCell className="p-4 text-sm">
                    {formatBreachDate(result.breachDate)}
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {result.dataTypes.map((type, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={
                        result.severity === "HIGH" ||
                        result.severity === "CRITICAL"
                          ? "destructive"
                          : result.severity === "MEDIUM"
                            ? "secondary"
                            : "outline"
                      }
                      className="px-3 py-1 text-sm"
                    >
                      {result.severity === "HIGH"
                        ? "Alta"
                        : result.severity === "MEDIUM"
                          ? "Media"
                          : result.severity === "CRITICAL"
                            ? "Crítica"
                            : "Baja"}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={result.isVerified ? "default" : "secondary"}
                      className="px-3 py-1 text-sm"
                    >
                      {result.isVerified ? "Verificado" : "Sin verificar"}
                    </Badge>
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
