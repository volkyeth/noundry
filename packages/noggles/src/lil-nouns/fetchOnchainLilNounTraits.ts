import { PublicClient } from "viem";
import { lilNounsDescriptorContract } from "../contracts/lil-nouns/lil-nouns-descriptor.js";
import { NounTraits } from "../types/artwork.js";
import { NounSeed } from "../types/seed.js";

export const fetchOnchainLilNounTraits = async (
  publicClient: PublicClient,
  seed: NounSeed
): Promise<NounTraits> => {
  const [glasses, head, accessory, body, background] =
    await publicClient.multicall({
      allowFailure: false,
      contracts: [
        {
          ...lilNounsDescriptorContract,
          functionName: "glasses",
          args: [BigInt(seed.glasses)],
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "heads",
          args: [BigInt(seed.head)],
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "accessories",
          args: [BigInt(seed.accessory)],
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "bodies",
          args: [BigInt(seed.body)],
        },
        {
          ...lilNounsDescriptorContract,
          functionName: "backgrounds",
          args: [BigInt(seed.background)],
        },
      ],
    });

  return { glasses, head, accessory, body, background: `#${background}` };
};
