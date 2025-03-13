"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import { Card, CardFooter } from "@/components/ui/card";
import type { Column } from "@/components/table/types";

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
  const router = useRouter();

  // Function to get badge color based on score
  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return "bg-gray-200 text-gray-800";
    if (score < 40) return "bg-red-100 text-red-800";
    if (score < 60) return "bg-orange-100 text-orange-800";
    if (score < 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const columns: Column<Evaluation>[] = [
    {
      id: "title",
      header: "Título",
      accessorKey: "title",
      cell: ({ row }) => <span className="font-medium">{row.title}</span>,
    },
    {
      id: "type",
      header: "Tipo",
      accessorKey: "type",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.type === "INITIAL" ? "Inicial" : "Avanzada"}
        </Badge>
      ),
    },
    {
      id: "score",
      header: "Puntuación",
      accessorKey: "score",
      cell: ({ row }) => (
        <Badge className={getScoreBadgeColor(row.score)} variant="secondary">
          {row.score !== null ? `${Math.round(row.score)}%` : "N/A"}
        </Badge>
      ),
    },
    {
      id: "date",
      header: "Fecha",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(row.createdAt), "d MMM yyyy", { locale: es })}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/evaluations/${row.id}`);
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="h-full flex flex-col p-4">
      <DataTable
        title="Evaluaciones Recientes"
        description="Tus últimas evaluaciones de ciberseguridad"
        data={evaluations}
        columns={columns}
        searchable={false}
        rowSelection={false}
        pageSize={5}
        pageSizeOptions={[]}
        hidePagination={true}
        onRowClick={(row) => router.push(`/evaluations/${row.id}`)}
      />
      <CardFooter className="px-0 pt-4">
        <Link href="/evaluations" className="w-full">
          <Button variant="outline" className="w-full">
            Ver todas las evaluaciones
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
