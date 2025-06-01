"use client";

import { useSimulateContract } from "wagmi";

import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { Trait } from "@/types/trait";
import { formatSubmissionType } from "@/utils/traits/format";
import {
  nounsDaoDataContract,
  nounsDescriptorContract,
  TraitCategory,
  TraitType
} from "noggles";
import { nounsDescriptorContractAddress } from "noggles/src/nouns/contracts/nouns-descriptor";
import { useEffect, useMemo } from "react";
import slugify from "slugify";
import { encodeFunctionData, getAbiItem, toFunctionSignature } from "viem";
import { compressAndEncodeTrait } from "../../../../app/propose/artworkEncoding";
import { useTraitColorIndexes } from "../../../../hooks/useTraitColorIndexes";
import { SubmissionCategory } from "@/types/submission";

export interface UseProposePartArgs {
  description?: string;
  trait: Trait;
  isNouner?: boolean;
  createCandidateCost?: bigint;
  paletteIndex?: number;
  logToConsole?: boolean;
}

export const useProposeTraitSimulation = ({
  description,
  trait,
  paletteIndex,
  createCandidateCost,
  isNouner,
  logToConsole
}: UseProposePartArgs) => {
  const slug = useMemo(
    () => slugify(`${trait.name} ${formatSubmissionType(trait.type)} ${(new Date()).toISOString().slice(0, 10)}`.toLowerCase()),
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
        abi: nounsDescriptorContract.abi,
        functionName,
        args: compressedEncodedArtwork,
      }).substring(10)) as `0x${string}`;
  }, [compressedEncodedArtwork, functionName]);

  const targets = [nounsDescriptorContract.address];
  const calldatas = [calldata];
  const signatures = useMemo(
    () => [
      toFunctionSignature(
        getAbiItem({ abi: nounsDescriptorContract.abi, name: functionName })
      ),
    ],
    [functionName]
  );

  const values = [0n];

  const enabled = description !== undefined &&
    compressedEncodedArtwork !== undefined &&
    paletteIndex !== undefined &&
    createCandidateCost !== undefined &&
    isNouner !== undefined &&
    palette !== undefined

  useEffect(() => {
    if (logToConsole) {
      console.log("description:");
      console.log(description);
      console.log("----------------------------");
      console.log("transaction:");
      console.log(`${nounsDescriptorContractAddress}.${functionName}(
${compressedEncodedArtwork}
)`);
    }
  }, [description, compressedEncodedArtwork, logToConsole, functionName]);


  return useSimulateContract({
    ...nounsDaoDataContract,
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
    query: {
      enabled
    }
  });
};

const getAddPartCallFunc = (traitType: TraitType | TraitCategory | "nouns") => {
  switch (traitType) {
    case "background":
    case "backgrounds":
      throw new Error("Proposing backgrounds is not supported");
    case "nouns":
      throw new Error("Proposing complete nouns is not supported - only individual traits can be proposed");
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
