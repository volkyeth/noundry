import { PublicClient } from "viem";
import { NounSeed } from "../types/seed.js";
import { lilNounsTokenContract } from "./contracts/lil-nouns-token.js";

export const fetchLilNounSeed = async (
  publicClient: PublicClient,
  lilNounId: number
): Promise<NounSeed> => {
  const [background, body, accessory, head, glasses] = await publicClient.readContract({
    ...lilNounsTokenContract,
    functionName: "seeds",
    args: [BigInt(lilNounId)],
  });

  return { background, body, accessory, head, glasses };
};
