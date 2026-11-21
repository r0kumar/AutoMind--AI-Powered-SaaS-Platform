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
    staleTime: 0,
  });

  const mutation = useMutation({
    mutationFn: async (newRecord: Partial<Row>) => {
      return await customFetch<Row>(`/api/data/${moduleKey}`, {
        method: "POST",
        body: JSON.stringify(newRecord),
      });
    },
    onSuccess: (savedRecord) => {
      if (savedRecord && savedRecord.id) {
        queryClient.setQueryData<Row[]>(["moduleData", moduleKey], (old = []) => [
          savedRecord,
          ...old.filter((r) => r.id !== savedRecord.id),
        ]);
      }
      queryClient.invalidateQueries({ queryKey: ["moduleData", moduleKey] });
      queryClient.invalidateQueries({ queryKey: ["kpis"] });
    },
  });

  return {
    records,
    isLoading,
    isError,
    save: async (record: Row, onDone?: () => void) => {
      try {
        await mutation.mutateAsync(record);
        onDone?.();
      } catch (err) {
        console.error(`Failed to save record to ${moduleKey}:`, err);
      }
    },
    isSaving: mutation.isPending,
  };
}
