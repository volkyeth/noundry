import { AVERAGE_MAINNET_BLOCK_TIME } from "../../constants/ethereum";
import {
  useNounsDaoProposalUpdatablePeriodInBlocks,
  useNounsDaoVotingDelay,
  useNounsDaoVotingPeriod,
  useNounsExecutorDelay,
} from "../../generated";

export const useEstimatedProposalExecutionDelay = () => {
  const { data: timelockDelayInSeconds } = useNounsExecutorDelay();
  const { data: updatablePeriodInBlocks } =
    useNounsDaoProposalUpdatablePeriodInBlocks();
  const { data: pendingPeriodInBlocks } = useNounsDaoVotingDelay();
  const { data: votingPeriodInBlocks } = useNounsDaoVotingPeriod();

  if (
    timelockDelayInSeconds === undefined ||
    updatablePeriodInBlocks === undefined ||
    pendingPeriodInBlocks === undefined ||
    votingPeriodInBlocks === undefined
  )
    return undefined;

  return (
    timelockDelayInSeconds +
    [updatablePeriodInBlocks, pendingPeriodInBlocks, votingPeriodInBlocks]
      .map(toSeconds)
      .reduce((a, b) => a + b, 0n)
  );
};

const toSeconds = (blocks: bigint) =>
  BigInt(Math.floor(Number(blocks) * AVERAGE_MAINNET_BLOCK_TIME));
