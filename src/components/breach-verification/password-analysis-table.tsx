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
import type { PasswordAnalysis } from "@/types/breach-verification";
import { PasswordStrength } from "@prisma/client";

interface PasswordAnalysisTableProps {
  analysis: PasswordAnalysis[];
}

function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
    case PasswordStrength.WEAK:
      return "destructive";
    case PasswordStrength.MEDIUM:
      return "secondary";
    case PasswordStrength.STRONG:
    case PasswordStrength.VERY_STRONG:
      return "default";
    default:
      return "outline";
  }
}

function getPasswordStrengthLabel(strength: PasswordStrength): string {
  switch (strength) {
    case PasswordStrength.VERY_WEAK:
      return "Muy Débil";
    case PasswordStrength.WEAK:
      return "Débil";
    case PasswordStrength.MEDIUM:
      return "Media";
    case PasswordStrength.STRONG:
      return "Fuerte";
    case PasswordStrength.VERY_STRONG:
      return "Muy Fuerte";
    default:
      return "Desconocida";
  }
}

export function PasswordAnalysisTable({
  analysis,
}: PasswordAnalysisTableProps) {
  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          🔐 Análisis de Contraseñas Encontradas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-4 font-semibold text-base">
                  Contraseña
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Apariciones
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Fortaleza
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Tiempo de Crackeo
                </TableHead>
                <TableHead className="p-4 font-semibold text-base">
                  Recomendación
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analysis.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="p-4 font-mono text-sm">
                    <span
                      className="blur-sm hover:blur-none transition-all cursor-pointer bg-muted/50 px-2 py-1 rounded"
                      title="Hover para revelar hash de contraseña"
                    >
                      {"•".repeat(12)}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="font-semibold text-lg">
                      {item.occurrences}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      variant={getPasswordStrengthColor(item.strength) as any}
                      className="px-3 py-1 text-sm"
                    >
                      {getPasswordStrengthLabel(item.strength)}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4 text-sm">
                    {item.crackTime || "N/A"}
                  </TableCell>
                  <TableCell className="p-4 text-sm font-medium text-muted-foreground">
                    {item.recommendation}
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
