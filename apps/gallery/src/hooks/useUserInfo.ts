import { UserInfo } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = (address?: `0x${string}`) =>
  useQuery({
    queryKey: ["user-info", address],
    queryFn: async () => {
      if (!address) return null;
      const response = await fetch(`/api/user/${address}/info`);
      if (!response.ok) throw new Error('Failed to fetch user info');
      return response.json() as Promise<UserInfo>;
    },
  });