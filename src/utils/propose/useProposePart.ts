import {
  useNounsDataCreateCandidateCost,
  useNounsDataCreateProposalCandidate,
  usePrepareNounsDataCreateProposalCandidate,
} from "../../generated";
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
  const { data: createCandidateCost } = useNounsDataCreateCandidateCost();

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

  const { config } = usePrepareNounsDataCreateProposalCandidate({
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

  console.log({
    transactions,
    partType,
    partName,
    artistAddress,
    droposalMediaUri,
    partBitmap,
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

  return useNounsDataCreateProposalCandidate(config);
};
