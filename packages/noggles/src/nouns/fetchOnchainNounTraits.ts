import { PublicClient } from "viem";
import { nounsDescriptorContract } from "../contracts/nouns/nouns-descriptor.js";
import { NounTraits } from "../types/artwork.js";
import { NounSeed } from "../types/seed.js";

export const fetchOnchainNounTraits = async (
  publicClient: PublicClient,
  seed: NounSeed
): Promise<NounTraits> => {
  const [glasses, head, accessory, body, background] =
    await publicClient.multicall({
      allowFailure: false,
      contracts: [
        {
          ...nounsDescriptorContract,
          functionName: "glasses",
          args: [BigInt(seed.glasses)],
        },
        {
          ...nounsDescriptorContract,
          functionName: "heads",
          args: [BigInt(seed.head)],
        },
        {
          ...nounsDescriptorContract,
          functionName: "accessories",
          args: [BigInt(seed.accessory)],
        },
        {
          ...nounsDescriptorContract,
          functionName: "bodies",
          args: [BigInt(seed.body)],
        },
        {
          ...nounsDescriptorContract,
          functionName: "backgrounds",
          args: [BigInt(seed.background)],
        },
      ],
    });

  return { glasses, head, accessory, body, background: `#${background}` };
};
