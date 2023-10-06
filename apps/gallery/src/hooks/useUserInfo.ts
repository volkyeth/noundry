import { UserInfo } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = (address: `0x${string}`) =>
  useQuery({
    queryKey: ["user-info", address],
    queryFn: () =>
      fetch(`/api/user/${address}/info`).then(
        (res) => res.json() as Promise<UserInfo>
      ),
  });
