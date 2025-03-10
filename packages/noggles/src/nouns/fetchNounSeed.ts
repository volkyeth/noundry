import { PublicClient } from "viem";
import { NounSeed } from "../types/seed.js";
import { nounsTokenContract } from "./contracts/nouns-token.js";

export const fetchNounSeed = async (
  publicClient: PublicClient,
  nounId: number
): Promise<NounSeed> => {
  const [background, body, accessory, head, glasses] = await publicClient.readContract({
    ...nounsTokenContract,
    functionName: "seeds",
    args: [BigInt(nounId)],
  });

  return { background, body, accessory, head, glasses };
};
