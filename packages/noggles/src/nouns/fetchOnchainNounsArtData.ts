import { PublicClient } from "viem";
import { EncodedTrait, HexColor, NounsArtData } from "../types/artwork.js";
import { nounsDescriptorContract } from "./contracts/nouns-descriptor.js";

export const fetchOnchainNounsArtData = async (
  publicClient: PublicClient
): Promise<NounsArtData> => {
  const [
    glassesCount,
    headsCount,
    accessoriesCount,
    bodiesCount,
    backgroundsCount,
  ] = await publicClient
    .multicall({
      allowFailure: false,
      contracts: [
        {
          ...nounsDescriptorContract,
          functionName: "glassesCount",
        },
        {
          ...nounsDescriptorContract,
          functionName: "headCount",
        },
        {
          ...nounsDescriptorContract,
          functionName: "accessoryCount",
        },
        {
          ...nounsDescriptorContract,
          functionName: "bodyCount",
        },
        {
          ...nounsDescriptorContract,
          functionName: "backgroundCount",
        },
      ],
    })
    .then((data) => data.map((result) => Number(result)));

  const glasses = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(glassesCount).fill(null).map((_, index) => ({
        ...nounsDescriptorContract,
        functionName: "glasses",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const heads = await publicClient
    .multicall({
      allowFailure: false,
      batchSize: 100,
      contracts: new Array(headsCount).fill(null).map((_, index) => ({
        ...nounsDescriptorContract,
        functionName: "heads",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const accessories = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(accessoriesCount).fill(null).map((_, index) => ({
        ...nounsDescriptorContract,
        functionName: "accessories",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const bodies = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(bodiesCount).fill(null).map((_, index) => ({
        ...nounsDescriptorContract,
        functionName: "bodies",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const backgrounds = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(backgroundsCount).fill(null).map((_, index) => ({
        ...nounsDescriptorContract,
        functionName: "backgrounds",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => `#${result}` as HexColor));
  const palettes = await publicClient
    .readContract({
      ...nounsDescriptorContract,
      functionName: "palettes",
      args: [0],
    })
    .then((data) => [
      data
        .slice(2)
        .match(/.{1,6}/g)!
        .map((hex, i) => (i === 0 ? "#00000000" : (`#${hex}` as HexColor))),
    ]);

  return { accessories, bodies, backgrounds, glasses, heads, palettes };
};
