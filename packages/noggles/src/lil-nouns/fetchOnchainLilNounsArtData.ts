import { PublicClient } from "viem";
import { EncodedTrait, HexColor, NounsArtData } from "../types/artwork.js";
import { lilNounsDescriptorContract } from "./contracts/lil-nouns-descriptor.js";

export const fetchOnchainLilNounsArtData = async (
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
          ...lilNounsDescriptorContract,
          functionName: "glassesCount",
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "headCount",
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "accessoryCount",
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "bodyCount",
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "backgroundCount",
        },
      ],
    })
    .then((data) => data.map((result) => Number(result)));

  const glasses = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(glassesCount).fill(null).map((_, index) => ({
        ...lilNounsDescriptorContract,
        functionName: "glasses",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const heads = await publicClient
    .multicall({
      allowFailure: false,
      batchSize: 25,
      contracts: new Array(headsCount).fill(null).map((_, index) => ({
        ...lilNounsDescriptorContract,
        functionName: "heads",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const accessories = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(accessoriesCount).fill(null).map((_, index) => ({
        ...lilNounsDescriptorContract,
        functionName: "accessories",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const bodies = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(bodiesCount).fill(null).map((_, index) => ({
        ...lilNounsDescriptorContract,
        functionName: "bodies",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => result as EncodedTrait));
  const backgrounds = await publicClient
    .multicall({
      allowFailure: false,
      contracts: new Array(backgroundsCount).fill(null).map((_, index) => ({
        ...lilNounsDescriptorContract,
        functionName: "backgrounds",
        args: [index],
      })),
    })
    .then((data) => data.map((result) => `#${result}` as HexColor));
  const palettes = await publicClient
    .readContract({
      ...lilNounsDescriptorContract,
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
