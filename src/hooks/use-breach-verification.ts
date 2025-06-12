import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BreachSearchResponse,
  SearchHistory,
} from "@/types/breach-verification";

interface BreachSearchData {
  type: "EMAIL" | "DOMAIN";
  searchValue: string;
}

interface APIResponse<T> {
  success: boolean;
  data: T;
}

export function useBreachVerification() {
  const [validationError, setValidationError] = useState("");
  const queryClient = useQueryClient();

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (
      searchData: BreachSearchData
    ): Promise<BreachSearchResponse> => {
      const response = await fetch("/api/breach-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al realizar la búsqueda de brechas"
        );
      }

      const result: APIResponse<BreachSearchResponse> = await response.json();
      return result.data;
    },
    onSuccess: () => {
      // Invalidate search history to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["breach-search-history"] });
      setValidationError("");
    },
    onError: (error: Error) => {
      setValidationError(error.message);
    },
  });

  // Search history query with enhanced loading states
  const {
    data: searchHistory = [],
    isLoading: isLoadingHistory,
    error: historyError,
    isFetching: isFetchingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["breach-search-history"],
    queryFn: async (): Promise<SearchHistory[]> => {
      const response = await fetch("/api/breach-verification");

      if (!response.ok) {
        throw new Error("Error al obtener el historial de búsquedas");
      }

      const result: APIResponse<SearchHistory[]> = await response.json();

      // Ensure dates are properly converted
      return result.data.map((item) => ({
        ...item,
        timestamp:
          item.timestamp instanceof Date
            ? item.timestamp
            : new Date(item.timestamp),
      }));
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const performSearch = async (searchData: BreachSearchData) => {
    setValidationError("");
    return searchMutation.mutateAsync(searchData);
  };

  const clearValidationError = () => {
    setValidationError("");
  };

  const clearHistory = async () => {
    try {
      const response = await fetch("/api/breach-verification/history", {
        method: "DELETE",
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["breach-search-history"] });
      }
    } catch (error) {
      console.error("Error al limpiar el historial:", error);
    }
  };

  return {
    // Search functionality
    performSearch,
    isSearching: searchMutation.isPending,
    searchError: validationError || searchMutation.error?.message,
    searchResults: searchMutation.data,
    isSearchSuccess: searchMutation.isSuccess,

    // Search history with enhanced loading states
    searchHistory,
    isLoadingHistory: isLoadingHistory || isFetchingHistory,
    historyError: historyError?.message,
    refetchHistory,
    clearHistory,

    // Utilities
    clearValidationError,
    resetSearch: searchMutation.reset,
  };
}

// Additional hook for managing search form state
export function useBreachSearchForm() {
  const [searchType, setSearchType] = useState("EMAIL");
  const [searchValue, setSearchValue] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const clearForm = () => {
    setSearchValue("");
    setHasSearched(false);
  };

  const resetForm = () => {
    setSearchType("EMAIL");
    setSearchValue("");
    setHasSearched(false);
  };

  const markAsSearched = () => {
    setHasSearched(true);
  };

  return {
    searchType,
    setSearchType,
    searchValue,
    setSearchValue,
    hasSearched,
    clearForm,
    resetForm,
    markAsSearched,
  };
}
