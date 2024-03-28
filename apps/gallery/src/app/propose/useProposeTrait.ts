"use client";

import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { nounsDaoDataAbi, nounsDaoDataAddress } from "@/contracts/nounsDaoData";
import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { Trait } from "@/types/trait";
import { formatTraitType } from "@/utils/traits/format";
import { TraitCategory, TraitType } from "noggles";
import {
  nounsDescriptorAbi,
  nounsDescriptorContractAddress,
} from "noggles/src/contracts/nounsDescriptor";
import { useMemo } from "react";
import slugify from "slugify";
import { encodeFunctionData, getAbiItem, getFunctionSignature } from "viem";
import { compressAndEncodeTrait } from "./artworkEncoding";
import { useTraitColorIndexes } from "./useTraitColorIndexes";

export interface UseProposePartArgs {
  description?: string;
  trait: Trait;
  isNouner?: boolean;
  createCandidateCost?: bigint;
  paletteIndex?: number;
}

export const useProposeTrait = ({
  description,
  trait,
  paletteIndex,
  createCandidateCost,
  isNouner,
}: UseProposePartArgs) => {
  const slug = useMemo(
    () => slugify(`${trait.name} ${formatTraitType(trait.type)}`.toLowerCase()),
    [trait]
  );
  const proposalIdToUpdate = 0n;
  const { data: mainnetArtwork } = useMainnetArtwork();
  const palette = useMemo(
    () => mainnetArtwork?.palettes[paletteIndex ?? 0],
    [mainnetArtwork, paletteIndex]
  );
  const traitColorIndexes = useTraitColorIndexes(trait.trait, palette);

  const compressedEncodedArtwork = useMemo(() => {
    if (!traitColorIndexes || paletteIndex === undefined) return undefined;

    return compressAndEncodeTrait(traitColorIndexes, paletteIndex);
  }, [traitColorIndexes, paletteIndex]);

  const functionName = useMemo(() => getAddPartCallFunc(trait.type), [trait]);

  const value = isNouner ? 0n : createCandidateCost;
  const calldata = useMemo(() => {
    if (!compressedEncodedArtwork) return "0x";

    return ("0x" +
      encodeFunctionData({
        abi: nounsDescriptorAbi,
        functionName,
        args: compressedEncodedArtwork,
      }).substring(10)) as `0x${string}`;
  }, [compressedEncodedArtwork, functionName]);

  const targets = [nounsDescriptorContractAddress];
  const calldatas = [calldata];
  const signatures = useMemo(
    () => [
      getFunctionSignature(
        getAbiItem({ abi: nounsDescriptorAbi, name: functionName })
      ),
    ],
    [functionName]
  );

  const values = [0n];

  const { config } = usePrepareContractWrite({
    abi: nounsDaoDataAbi,
    address: nounsDaoDataAddress,
    functionName: "createProposalCandidate",
    args: [
      targets,
      values,
      signatures,
      calldatas,
      description ?? "",
      slug,
      proposalIdToUpdate,
    ],
    value,
    enabled:
      description !== undefined &&
      compressedEncodedArtwork !== undefined &&
      paletteIndex !== undefined &&
      createCandidateCost !== undefined &&
      isNouner !== undefined &&
      palette !== undefined,
  });

  return useContractWrite(config);
};

const getAddPartCallFunc = (traitType: TraitType | TraitCategory) => {
  switch (traitType) {
    case "background":
    case "backgrounds":
      throw new Error("Proposing backgrounds is not supported");
    case "body":
    case "bodies":
      return "addBodies";
    case "accessory":
    case "accessories":
      return "addAccessories";
    case "head":
    case "heads":
      return "addHeads";
    case "glasses":
      return "addGlasses";
  }
};
