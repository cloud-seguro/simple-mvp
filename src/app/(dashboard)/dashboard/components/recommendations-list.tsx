"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface Recommendation {
  id: string;
  category: string;
  title: string;
  priority: "Alta" | "Media" | "Baja";
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  // Function to get priority badge color
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800";
      case "Media":
        return "bg-yellow-100 text-yellow-800";
      case "Baja":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Alta":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "Media":
        return <ShieldAlert className="h-4 w-4 text-yellow-600" />;
      case "Baja":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recomendaciones</CardTitle>
        <CardDescription>
          Acciones sugeridas para mejorar tu seguridad
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center">
              No hay recomendaciones disponibles.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="flex items-start gap-3 p-3 rounded-lg border"
              >
                <div className="mt-0.5">
                  {getPriorityIcon(recommendation.priority)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">
                      {recommendation.title}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={getPriorityBadgeColor(recommendation.priority)}
                    >
                      {recommendation.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Categoría: {recommendation.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
