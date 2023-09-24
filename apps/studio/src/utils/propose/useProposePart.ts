import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  nounsDaoDataAbi,
  nounsDaoDataAddress,
} from "../../constants/contracts/nounsDaoData";
import { NounPartType } from "../../types/noun";
import { useIsNouner } from "./useIsNouner";
import { useProposalTransactions } from "./useProposalTransactions";

export interface UseProposePartArgs {
  description: string;
  partType: NounPartType;
  partName: string;
  artistAddress?: `0x${string}`;
  droposalMediaUri: string;
  partBitmap: ImageBitmap;
}

export const useProposePart = ({
  description,
  partType,
  partName,
  artistAddress,
  droposalMediaUri,
  partBitmap,
}: UseProposePartArgs) => {
  const isNouner = useIsNouner(artistAddress);
  const { data: createCandidateCost } = useContractRead({
    abi: nounsDaoDataAbi,
    address: nounsDaoDataAddress,
    functionName: "createCandidateCost",
  });

  const transactions = useProposalTransactions({
    partType,
    partName,
    artistAddress,
    droposalMediaUri,
    partBitmap,
  });

  const slug = partName;
  const proposalIdToUpdate = 0n;
  const value = isNouner ? 0n : createCandidateCost;

  const targets = transactions?.targets || [];
  const calldatas = transactions?.calldatas || [];
  const signatures = transactions?.signatures || [];
  const values = transactions?.values || [];

  const enabled =
    !!transactions &&
    isNouner !== undefined &&
    createCandidateCost !== undefined;

  const { config } = usePrepareContractWrite({
    abi: nounsDaoDataAbi,
    address: nounsDaoDataAddress,
    functionName: "createProposalCandidate",
    enabled,
    args: [
      targets,
      values,
      signatures,
      calldatas,
      description,
      slug,
      proposalIdToUpdate,
    ],
    value,
  });

  return useContractWrite(config);
};
