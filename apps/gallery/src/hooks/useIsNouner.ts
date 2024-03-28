import { nounsTokenAbi, nounsTokenAddress } from "@/contracts/nounsToken";
import { useBlockNumber, useContractRead } from "wagmi";

export const useIsNouner = (address?: `0x${string}`) => {
  const { data: blockNumber } = useBlockNumber();
  const { data: votes } = useContractRead({
    abi: nounsTokenAbi,
    address: nounsTokenAddress,
    functionName: "getPriorVotes",
    enabled: !!address && !!blockNumber,
    args: [address!, (blockNumber ?? 0n) - 1n],
  });

  return votes !== undefined ? votes > 0n : undefined;
};
