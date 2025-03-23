import { useBlockNumber, useReadContract } from "wagmi";
import { appConfig } from "../variants/config";

export const useIsNouner = (address?: `0x${string}`) => {
  const { data: blockNumber } = useBlockNumber();
  const { data: votes } = useReadContract({
    ...appConfig.descriptorContract,
    functionName: "getPriorVotes",
    args: [address!, (blockNumber ?? 0n) - 1n],
  });

  if (votes === undefined || votes === null) {
    return undefined;
  }

  return (votes as bigint) > 0n;
};