import { useContractReads } from "wagmi";
import {
  nounsDaoAbi,
  nounsDaoAddress,
} from "../../constants/contracts/nounsDao";
import {
  nounsDaoExecutorAbi,
  nounsDaoExecutorAddress,
} from "../../constants/contracts/nounsDaoExecutor";
import { AVERAGE_MAINNET_BLOCK_TIME } from "../../constants/ethereum";

export const useEstimatedProposalExecutionDelay = () => {
  const executorContract = {
    abi: nounsDaoExecutorAbi,
    address: nounsDaoExecutorAddress,
  };

  const daoContract = {
    abi: nounsDaoAbi,
    address: nounsDaoAddress,
  };

  const { data } = useContractReads({
    contracts: [
      { ...executorContract, functionName: "delay" },
      { ...daoContract, functionName: "proposalUpdatablePeriodInBlocks" },
      { ...daoContract, functionName: "votingDelay" },
      { ...daoContract, functionName: "votingPeriod" },
    ],
  });

  if (data === undefined || data[0].result) return undefined;

  const [
    timelockDelayInSeconds,
    updatablePeriodInBlocks,
    pendingPeriodInBlocks,
    votingPeriodInBlocks,
  ] = data;

  if (
    timelockDelayInSeconds.result === undefined ||
    updatablePeriodInBlocks.result === undefined ||
    pendingPeriodInBlocks.result === undefined ||
    votingPeriodInBlocks.result === undefined
  )
    return undefined;

  return (
    timelockDelayInSeconds.result +
    [
      updatablePeriodInBlocks.result,
      pendingPeriodInBlocks.result,
      votingPeriodInBlocks.result,
    ]
      .map(toSeconds)
      .reduce((a, b) => a + b, 0n)
  );
};

const toSeconds = (blocks: bigint) =>
  BigInt(Math.floor(Number(blocks) * AVERAGE_MAINNET_BLOCK_TIME));
