import { useQuery } from "@tanstack/react-query";
import { OnchainArtwork } from "noggles";

export const useMainnetArtwork = () =>
  useQuery<OnchainArtwork>({
    queryKey: ["mainnet-artwork"],
    queryFn: () => fetch("/api/nouns/traits").then((r) => r.json()),
    staleTime: 1000 * 60 * 15,
  });
