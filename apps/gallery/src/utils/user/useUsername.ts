import { useEnsName } from "wagmi";
import { shortAddress } from "../address/format";

export const useUsername = (address: `0x${string}`) => {
  const { data: ensName } = useEnsName({ address });

  return ensName || shortAddress(address);
};
