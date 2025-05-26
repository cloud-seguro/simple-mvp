"use client";

import { useQuery } from "@tanstack/react-query";
import type { Evaluation } from "@prisma/client";

interface UseEvaluationsOptions {
  sortOrder?: "asc" | "desc";
}

interface EvaluationsResponse {
  evaluations: Evaluation[];
}

const fetchEvaluations = async (
  sortOrder: "asc" | "desc" = "desc"
): Promise<EvaluationsResponse> => {
  const params = new URLSearchParams();
  params.set("sortOrder", sortOrder);

  const response = await fetch(`/api/evaluations?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch evaluations");
  }

  return response.json();
};

export const useEvaluations = (options: UseEvaluationsOptions = {}) => {
  const { sortOrder = "desc" } = options;

  return useQuery({
    queryKey: ["evaluations", sortOrder],
    queryFn: () => fetchEvaluations(sortOrder),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
