import { useBlockNumber } from "wagmi";
import { useNounsTokenGetPriorVotes } from "../../generated";

export const useIsNouner = (address?: `0x${string}`) => {
  const { data: currentBlockNumber } = useBlockNumber();
  const previousBlockNumber = currentBlockNumber
    ? currentBlockNumber - 1n
    : undefined;

  const votes = useNounsTokenGetPriorVotes({
    enabled: !!address && !!previousBlockNumber,
    args: [address as `0x${string}`, previousBlockNumber as bigint],
  });

  return votes.isError
    ? false
    : votes.data === undefined
    ? undefined
    : votes.data > 0n;
};
