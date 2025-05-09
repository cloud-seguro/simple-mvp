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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Add a proper type for the metadata object
interface GuestMetadata {
  guestInfo?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    phoneNumber?: string;
  };
  interest?: {
    reason?: string;
    otherReason?: string;
  };
}

interface EvaluationWithProfile extends Evaluation {
  profile?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    company: string | null;
  } | null;
  guestFirstName: string | null;
  guestLastName: string | null;
  guestCompany: string | null;
  guestPhoneNumber: string | null;
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

  // Function to get badge color based on normalized score (0-100%)
  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return "bg-gray-200 text-gray-800";
    if (score < 40) return "bg-red-100 text-red-800";
    if (score < 60) return "bg-orange-100 text-orange-800";
    if (score < 80) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Function to normalize score based on evaluation type
  const normalizeScore = (evaluation: EvaluationWithProfile): number => {
    if (evaluation.score === null) return 0;

    // For initial evaluations, convert from out of 45 to percentage
    if (evaluation.type === "INITIAL") {
      return Math.round((evaluation.score / 45) * 100);
    }

    // Advanced evaluations are already out of 100
    return Math.round(evaluation.score);
  };

  // Helper to format user name
  const formatUserName = (evaluation: EvaluationWithProfile) => {
    if (evaluation.profile) {
      const firstName = evaluation.profile.firstName || "";
      const lastName = evaluation.profile.lastName || "";
      return `${firstName} ${lastName}`.trim() || "N/A";
    }

    // Use guest fields directly if available
    if (evaluation.guestFirstName || evaluation.guestLastName) {
      const firstName = evaluation.guestFirstName || "";
      const lastName = evaluation.guestLastName || "";
      return `${firstName} ${lastName}`.trim();
    }

    // Fall back to checking metadata
    if (evaluation.metadata && typeof evaluation.metadata === "object") {
      const metadata = evaluation.metadata as GuestMetadata;
      if (metadata.guestInfo?.firstName || metadata.guestInfo?.lastName) {
        const firstName = metadata.guestInfo.firstName || "";
        const lastName = metadata.guestInfo.lastName || "";
        return `${firstName} ${lastName}`.trim();
      }
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
    if (evaluation.profile?.company) {
      return evaluation.profile.company;
    }

    // Use guest company field directly if available
    if (evaluation.guestCompany) {
      return evaluation.guestCompany;
    }

    // Fall back to checking metadata
    if (evaluation.metadata && typeof evaluation.metadata === "object") {
      const metadata = evaluation.metadata as GuestMetadata;
      if (metadata.guestInfo?.company) {
        return metadata.guestInfo.company;
      }
    }

    return "N/A";
  };

  // Helper to get user phone
  const getUserPhone = (evaluation: EvaluationWithProfile) => {
    // Use guest phone field directly if available
    if (evaluation.guestPhoneNumber) {
      return evaluation.guestPhoneNumber;
    }

    // Fall back to checking metadata
    if (evaluation.metadata && typeof evaluation.metadata === "object") {
      const metadata = evaluation.metadata as GuestMetadata;
      if (metadata.guestInfo?.phoneNumber) {
        return metadata.guestInfo.phoneNumber;
      }
    }

    return "N/A";
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
          {row.guestEmail && !row.profileId && (
            <Badge
              variant="outline"
              className="ml-2 bg-blue-50 text-blue-700 border-blue-200"
            >
              Invitado
            </Badge>
          )}
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
      id: "phone",
      header: "Teléfono",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>{getUserPhone(row)}</span>
        </div>
      ),
    },
    {
      id: "score",
      header: "Puntuación",
      accessorKey: "score",
      cell: ({ row }) => {
        const normalizedScore = normalizeScore(row);
        const originalScore = row.score;
        const scoreType = row.type === "INITIAL" ? "de 45" : "de 100";

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  className={getScoreBadgeColor(normalizedScore)}
                  variant="secondary"
                >
                  {row.score !== null ? `${normalizedScore}%` : "N/A"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {originalScore !== null
                    ? `Puntuación original: ${Math.round(originalScore)} ${scoreType} puntos`
                    : "No disponible"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
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

  // Additional columns specific to guest evaluations
  const guestColumns: Column<EvaluationWithProfile>[] = [
    ...columns, // Include all standard columns
    {
      id: "accessCode",
      header: "Código de Acceso",
      accessorKey: "accessCode",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-gray-100 p-1 rounded">
            {row.accessCode || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "interest",
      header: "Interés",
      cell: ({ row }) => {
        // Extract interest data from metadata
        let interestReason = "N/A";

        if (row.metadata && typeof row.metadata === "object") {
          const metadata = row.metadata as GuestMetadata;
          if (metadata.interest?.reason) {
            interestReason = metadata.interest.reason;
            if (metadata.interest.otherReason && interestReason === "other") {
              interestReason = metadata.interest.otherReason;
            }
          }
        }

        return (
          <div className="max-w-[200px] truncate" title={interestReason}>
            {interestReason}
          </div>
        );
      },
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
          columns={guestColumns}
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
