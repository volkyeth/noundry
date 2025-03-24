"use client";

import { useSimulateContract } from "wagmi";

import { useMainnetArtwork } from "@/hooks/useMainnetArtwork";
import { Trait } from "@/types/trait";
import {
  lilNounsDAOContract,
  lilNounsDescriptorContract,
  TraitCategory,
  TraitType
} from "noggles";
import { useMemo } from "react";
import { encodeFunctionData, getAbiItem, toFunctionSignature } from "viem";
import { compressAndEncodeTrait } from "../../../../app/propose/artworkEncoding";
import { useTraitColorIndexes } from "../../../../hooks/useTraitColorIndexes";

export interface UseProposePartArgs {
  description?: string;
  trait: Trait;
  paletteIndex?: number;
}

export const useProposeTraitSimulation = ({
  description,
  trait,
  paletteIndex,
}: UseProposePartArgs) => {
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

  const calldata = useMemo(() => {
    if (!compressedEncodedArtwork) return "0x";

    return ("0x" +
      encodeFunctionData({
        abi: lilNounsDescriptorContract.abi,
        functionName,
        args: compressedEncodedArtwork,
      }).substring(10)) as `0x${string}`;
  }, [compressedEncodedArtwork, functionName]);

  const targets = [lilNounsDescriptorContract.address];
  const calldatas = [calldata];
  const signatures = useMemo(
    () => [
      toFunctionSignature(
        getAbiItem({ abi: lilNounsDescriptorContract.abi, name: functionName })
      ),
    ],
    [functionName]
  );

  const values = [0n];

  const enabled = description !== undefined &&
    compressedEncodedArtwork !== undefined &&
    paletteIndex !== undefined &&
    palette !== undefined

  return useSimulateContract({
    ...lilNounsDAOContract,
    functionName: "propose",

    args: [
      targets,
      values,
      signatures,
      calldatas,
      description ?? "",
    ],
    query: {
      enabled
    }
  });
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
