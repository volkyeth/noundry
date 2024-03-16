import { UserInfo } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = (address?: `0x${string}`) =>
  useQuery({
    queryKey: ["user-info", address],
    queryFn: () => (address ? fetchUserInfo(address) : null),
  });

export const fetchUserInfo = (address: `0x${string}`) =>
  fetch(`/api/user/${address}/info`)
    .then((res) => res.json() as Promise<UserInfo>)
    .then(({ userName, ...rest }) => ({
      userName: userName.toLowerCase(),
      ...rest,
    }));
