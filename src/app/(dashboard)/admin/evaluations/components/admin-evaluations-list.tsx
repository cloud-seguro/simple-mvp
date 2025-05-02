"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Evaluation } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, User, Mail, Building } from "lucide-react";
import { DataTable } from "@/components/table/data-table";
import type { Column } from "@/components/table/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EvaluationWithProfile extends Evaluation {
  profile?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
  } | null;
}

interface AdminEvaluationsListProps {
  allEvaluations: EvaluationWithProfile[];
  initialEvaluations: EvaluationWithProfile[];
  advancedEvaluations: EvaluationWithProfile[];
  guestEvaluations: EvaluationWithProfile[];
}

export function AdminEvaluationsList({
  allEvaluations,
  initialEvaluations,
  advancedEvaluations,
  guestEvaluations,
}: AdminEvaluationsListProps) {
  const router = useRouter();

  // Function to get badge color based on score
  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return "bg-gray-200 text-gray-800";
    if (score < 40) return "bg-red-100 text-red-800";
    if (score < 60) return "bg-orange-100 text-orange-800";
    if (score < 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Helper to format user name
  const formatUserName = (evaluation: EvaluationWithProfile) => {
    if (evaluation.profile) {
      const firstName = evaluation.profile.firstName || "";
      const lastName = evaluation.profile.lastName || "";
      return `${firstName} ${lastName}`.trim() || "N/A";
    }
    return evaluation.guestEmail ? "Invitado" : "N/A";
  };

  // Helper to get user email
  const getUserEmail = (evaluation: EvaluationWithProfile) => {
    if (evaluation.profile?.email) {
      return evaluation.profile.email;
    }
    return evaluation.guestEmail || "N/A";
  };

  // Helper to get user company
  const getUserCompany = (evaluation: EvaluationWithProfile) => {
    return evaluation.profile?.company || "N/A";
  };

  const columns: Column<EvaluationWithProfile>[] = [
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
      id: "user",
      header: "Usuario",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{formatUserName(row)}</span>
        </div>
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="max-w-[200px] truncate" title={getUserEmail(row)}>
            {getUserEmail(row)}
          </span>
        </div>
      ),
    },
    {
      id: "company",
      header: "Empresa",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{getUserCompany(row)}</span>
        </div>
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
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid grid-cols-4 w-[600px] mb-6">
        <TabsTrigger value="all">Todas ({allEvaluations.length})</TabsTrigger>
        <TabsTrigger value="initial">
          Iniciales ({initialEvaluations.length})
        </TabsTrigger>
        <TabsTrigger value="advanced">
          Avanzadas ({advancedEvaluations.length})
        </TabsTrigger>
        <TabsTrigger value="guest">
          Invitados ({guestEvaluations.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <DataTable
          title="Todas las Evaluaciones"
          description="Listado completo de evaluaciones en la plataforma"
          data={allEvaluations}
          columns={columns}
          searchable={true}
          searchField="title"
          defaultSort={{ field: "createdAt", direction: "desc" }}
          rowSelection={false}
          pageSize={15}
          onRowClick={(row) => router.push(`/evaluations/${row.id}`)}
        />
      </TabsContent>

      <TabsContent value="initial">
        <DataTable
          title="Evaluaciones Iniciales"
          description="Listado de evaluaciones iniciales"
          data={initialEvaluations}
          columns={columns}
          searchable={true}
          searchField="title"
          defaultSort={{ field: "createdAt", direction: "desc" }}
          rowSelection={false}
          pageSize={15}
          onRowClick={(row) => router.push(`/evaluations/${row.id}`)}
        />
      </TabsContent>

      <TabsContent value="advanced">
        <DataTable
          title="Evaluaciones Avanzadas"
          description="Listado de evaluaciones avanzadas"
          data={advancedEvaluations}
          columns={columns}
          searchable={true}
          searchField="title"
          defaultSort={{ field: "createdAt", direction: "desc" }}
          rowSelection={false}
          pageSize={15}
          onRowClick={(row) => router.push(`/evaluations/${row.id}`)}
        />
      </TabsContent>

      <TabsContent value="guest">
        <DataTable
          title="Evaluaciones de Invitados"
          description="Listado de evaluaciones realizadas por invitados"
          data={guestEvaluations}
          columns={columns}
          searchable={true}
          searchField="title"
          defaultSort={{ field: "createdAt", direction: "desc" }}
          rowSelection={false}
          pageSize={15}
          onRowClick={(row) => router.push(`/evaluations/${row.id}`)}
        />
      </TabsContent>
    </Tabs>
  );
}
