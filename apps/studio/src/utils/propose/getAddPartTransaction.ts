import { ImageData } from "@nouns/assets";
import { encodeFunctionData, getAbiItem } from "viem";
import {
  nounsDescriptorV2Abi,
  nounsDescriptorV2Address,
} from "../../constants/contracts/nounsDescriptorV2";
import { NounPartType } from "../../types/noun";
import { Transaction } from "../../types/proposal";
import { compressAndEncodeArtwork } from "../artworkEncoding";
import { getFunctionSignature } from "./getFunctionSignature";

export const getAddPartTransaction = (
  partType: NounPartType,
  partCanvas: HTMLCanvasElement
): Transaction => {
  const compressedEncodedArtwork = compressAndEncodeArtwork(
    partCanvas,
    ImageData.palette,
    0
  );
  const target = nounsDescriptorV2Address;
  const value = 0n;
  const functionName = getAddPartCallFunc(partType);
  const calldata = ("0x" +
    encodeFunctionData({
      abi: nounsDescriptorV2Abi,
      functionName,
      args: compressedEncodedArtwork,
    }).substring(10)) as `0x${string}`;
  const signature = getFunctionSignature(
    getAbiItem({ abi: nounsDescriptorV2Abi, name: functionName })
  );

  return { target, calldata, signature, value };
};
const getAddPartCallFunc = (partType: NounPartType) => {
  switch (partType) {
    case "background":
      throw new Error("Proposing backgrounds is not supported");
    case "body":
      return "addBodies";
    case "accessory":
      return "addAccessories";
    case "head":
      return "addHeads";
    case "glasses":
      return "addGlasses";
  }
};
