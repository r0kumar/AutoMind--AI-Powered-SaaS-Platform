import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { initialRows } from "@/data/mockData";
import type { Row } from "@/types";

export function useModuleData(moduleKey: string) {
  const queryClient = useQueryClient();
  const fallback = initialRows[moduleKey] || [];

  const { data: records = fallback, isLoading, isError } = useQuery<Row[]>({
    queryKey: ["moduleData", moduleKey],
    queryFn: async () => {
      const res = await fetch(`/api/data/${moduleKey}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${moduleKey}`);
      }
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data : fallback;
    },
    staleTime: 1000 * 30,
  });

  const mutation = useMutation({
    mutationFn: async (newRecord: Partial<Row>) => {
      const res = await fetch(`/api/data/${moduleKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) {
        throw new Error("Failed to save record");
      }
      return res.json();
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
