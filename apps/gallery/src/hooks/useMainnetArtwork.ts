import { useQuery } from "@tanstack/react-query";
import { OnchainArtwork } from "noggles";
import { appConfig } from "../variants/config";

export const useMainnetArtwork = () =>
  useQuery<OnchainArtwork>({
    queryKey: ["mainnet-artwork", appConfig.variant],
    queryFn: () => fetch(appConfig.artworkDataUrl).then((r) => r.json()),
    staleTime: 1000 * 60 * 15,
  });
