import { getUserInfo } from "@/app/actions/getUserInfo";
import { UserInfo } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = (address?: `0x${string}`) =>
  useQuery({
    queryKey: ["user-info", address],
    queryFn: () => (address ? getUserInfo(address) : null),
  });