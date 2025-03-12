"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Evaluation } from "@prisma/client";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Eye,
  FileBarChart,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface EvaluationsListProps {
  evaluations: Evaluation[];
}

export function EvaluationsList({ evaluations }: EvaluationsListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INITIAL" | "ADVANCED">(
    "ALL"
  );

  // Filter evaluations based on search term and filter type
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch = evaluation.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = filterType === "ALL" || evaluation.type === filterType;

    return matchesSearch && matchesType;
  });

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

  // Function to get evaluation type display text
  const getEvaluationTypeText = (type: string) => {
    return type === "INITIAL" ? "Inicial" : "Avanzada";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tus Evaluaciones</CardTitle>
        <CardDescription>
          Historial completo de tus evaluaciones de ciberseguridad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar evaluaciones..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtrar
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType("ALL")}>
                Todas las evaluaciones
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("INITIAL")}>
                Evaluaciones Iniciales
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("ADVANCED")}>
                Evaluaciones Avanzadas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredEvaluations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileBarChart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              No se encontraron evaluaciones
            </h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {searchTerm || filterType !== "ALL"
                ? "Intenta cambiar los filtros de búsqueda"
                : "Realiza tu primera evaluación para ver resultados aquí"}
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
                {filteredEvaluations.map((evaluation) => (
                  <TableRow
                    key={evaluation.id}
                    className={`${getRowHoverColor(evaluation.score)} cursor-pointer transition-colors`}
                    onClick={() => router.push(`/evaluations/${evaluation.id}`)}
                  >
                    <TableCell className="font-medium">
                      {evaluation.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getEvaluationTypeText(evaluation.type)}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/evaluations/${evaluation.id}`);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredEvaluations.length} de {evaluations.length}{" "}
          evaluaciones
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BarChart3 className="mr-2 h-4 w-4" />
          Promedio:{" "}
          {evaluations.length > 0
            ? `${Math.round(
                evaluations.reduce((acc, curr) => acc + (curr.score || 0), 0) /
                  evaluations.length
              )}%`
            : "N/A"}
        </div>
      </CardFooter>
    </Card>
  );
}
