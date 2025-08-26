import { shortAddress } from "../utils/address/format";
import { useUserInfo } from "./useUserInfo";

export const useUsername = (address?: `0x${string}`) => {
  const { data: userInfo } = useUserInfo(address);

  if (!address) return undefined;

  // userInfo.userName already includes proper fallback: userName -> ensName -> shortAddress
  return userInfo?.userName || shortAddress(address);
};
