import { useQuery } from "@tanstack/react-query";

export const useTrait = (
  id?: string | null,
  options?: { requester?: `0x${string}` }
) => {
  return useQuery({
    queryKey: ["trait", id, options?.requester],
    queryFn: async () => {
      const response = await fetch(`/api/trait/${id!}`);
      if (!response.ok) throw new Error('Failed to fetch trait');
      return response.json();
    },
    enabled: !!id,
  });
};