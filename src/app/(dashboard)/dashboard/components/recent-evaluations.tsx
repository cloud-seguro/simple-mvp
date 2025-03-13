"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Eye } from "lucide-react";

interface Evaluation {
  id: string;
  type: string;
  title: string;
  score: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

interface RecentEvaluationsProps {
  evaluations: Evaluation[];
}

export function RecentEvaluations({ evaluations }: RecentEvaluationsProps) {
  // Function to get badge color based on score
  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return "bg-gray-200 text-gray-800";
    if (score < 40) return "bg-red-100 text-red-800";
    if (score < 60) return "bg-orange-100 text-orange-800";
    if (score < 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Function to get row hover color based on score
  const getRowHoverColor = (score: number | null) => {
    if (score === null) return "hover:bg-gray-50";
    if (score < 40) return "hover:bg-red-50";
    if (score < 60) return "hover:bg-orange-50";
    if (score < 80) return "hover:bg-yellow-50";
    return "hover:bg-green-50";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Evaluaciones Recientes</CardTitle>
        <CardDescription>
          Tus últimas evaluaciones de ciberseguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {evaluations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center">
              No has completado ninguna evaluación aún.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Puntuación</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evaluations.map((evaluation) => (
                  <TableRow
                    key={evaluation.id}
                    className={`${getRowHoverColor(
                      evaluation.score
                    )} cursor-pointer transition-colors`}
                  >
                    <TableCell className="font-medium">
                      {evaluation.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {evaluation.type === "INITIAL" ? "Inicial" : "Avanzada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getScoreBadgeColor(evaluation.score)}
                        variant="secondary"
                      >
                        {evaluation.score !== null
                          ? `${Math.round(evaluation.score)}%`
                          : "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(
                            new Date(evaluation.createdAt),
                            "d MMM yyyy",
                            { locale: es }
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/evaluations/${evaluation.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/evaluations" className="w-full">
          <Button variant="outline" className="w-full">
            Ver todas las evaluaciones
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
