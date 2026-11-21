import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@/api/custom-fetch";
import { initialRows } from "@/data/mockData";
import type { Row } from "@/types";

export function useModuleData(moduleKey: string) {
  const queryClient = useQueryClient();
  const fallback = initialRows[moduleKey] || [];

  const { data: records = fallback, isLoading, isError } = useQuery<Row[]>({
    queryKey: ["moduleData", moduleKey],
    queryFn: async () => {
      try {
        const data = await customFetch<Row[]>(`/api/data/${moduleKey}`);
        return Array.isArray(data) && data.length > 0 ? data : fallback;
      } catch (error) {
        console.warn(`Could not load live data for ${moduleKey}, using fallback mock data:`, error);
        return fallback;
      }
    },
    staleTime: 1000 * 30,
  });

  const mutation = useMutation({
    mutationFn: async (newRecord: Partial<Row>) => {
      return await customFetch<Row>(`/api/data/${moduleKey}`, {
        method: "POST",
        body: JSON.stringify(newRecord),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moduleData", moduleKey] });
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
    },
  });

  return {
    records,
    isLoading,
    isError,
    save: (record: Row, onDone?: () => void) => {
      mutation.mutate(record, {
        onSuccess: () => onDone?.(),
      });
    },
    isSaving: mutation.isPending,
  };
}
