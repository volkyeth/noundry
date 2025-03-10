import { nounsTokenContract } from "noggles";
import { useBlockNumber, useReadContract } from "wagmi";

export const useIsNouner = (address?: `0x${string}`) => {
  const { data: blockNumber } = useBlockNumber();
  const { data: votes } = useReadContract({
    ...nounsTokenContract,
    functionName: "getPriorVotes",
    args: [address!, (blockNumber ?? 0n) - 1n],
  });

  return votes !== undefined ? votes > 0n : undefined;
};