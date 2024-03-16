import { useEnsName } from "wagmi";
import { shortAddress } from "../utils/address/format";
import { useUserInfo } from "./useUserInfo";

export const useUsername = (address?: `0x${string}`) => {
  const { data: ensName } = useEnsName({ address });
  const { data: userInfo } = useUserInfo(address);

  if (!address) return undefined;

  return userInfo?.userName?.toLowerCase() || ensName || shortAddress(address);
};
