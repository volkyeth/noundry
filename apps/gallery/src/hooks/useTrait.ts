import { getTrait } from "@/app/actions/getTrait";
import { useQuery } from "@tanstack/react-query";

export const useTrait = (
  id?: string | null,
  options?: { requester?: `0x${string}` }
) => {
  return useQuery({
    queryKey: ["trait", id, options?.requester],
    queryFn: () => getTrait(id!, options),
    enabled: !!id,
  });
};