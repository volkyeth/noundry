import { FarcasterUser } from "@/types/farcaster";
import { useQuery } from "@tanstack/react-query";

export const useFarcasterUser = (address?: `0x${string}`) =>
  useQuery({
    queryKey: ["farcaster-user", address],
    queryFn: async () => {
      if (!address) return null;

      const result = await fetch("/api/farcaster/user/" + address);
      if (result.status === 404) return null;

      return result.json() as Promise<FarcasterUser>;
    },
  });
