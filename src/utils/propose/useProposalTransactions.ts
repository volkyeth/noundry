import { useMemo } from "react";
import { NounPartType } from "../../types/noun";
import { drawCanvas } from "../canvas/drawCanvas";
import { getAddPartTransaction } from "./getAddPartTransaction";
import { getZoraEditionTransaction } from "./getZoraEditionTransaction";
import { useEstimatedProposalExecutionDelay } from "./useEstimatedProposalExecutionDelay";

export interface UseProposalTransactionsArgs {
  partType: NounPartType;
  partName: string;
  droposalMediaUri: string;
  partBitmap: ImageBitmap;
  artistAddress?: `0x${string}`;
}

export const useProposalTransactions = ({
  partType,
  partName,
  droposalMediaUri,
  partBitmap,
  artistAddress,
}: UseProposalTransactionsArgs) => {
  const estimatedProposalExecutionDelay = useEstimatedProposalExecutionDelay();
  return useMemo(() => {
    if (!estimatedProposalExecutionDelay || !artistAddress) return undefined;

    const partCanvas = document.createElement("canvas");
    partCanvas.width = partBitmap.width;
    partCanvas.height = partBitmap.height;
    drawCanvas(partBitmap, partCanvas);

    const editionTransaction = getZoraEditionTransaction(
      partType,
      partName,
      artistAddress,
      droposalMediaUri,
      estimatedProposalExecutionDelay
    );

    const addPartTransaction = getAddPartTransaction(partType, partCanvas);

    return {
      targets: [addPartTransaction.target, editionTransaction.target],
      calldatas: [addPartTransaction.calldata, editionTransaction.calldata],
      signatures: [addPartTransaction.signature, editionTransaction.signature],
      values: [addPartTransaction.value, editionTransaction.value],
    };
  }, [
    partType,
    partName,
    droposalMediaUri,
    partBitmap,
    artistAddress,
    estimatedProposalExecutionDelay,
  ]);
};
