import { PublicClient } from "viem";
import { lilNounsTokenContract } from "./contracts/lil-nouns-token.js";

export const fetchLatestLilNounId = async (
  publicClient: PublicClient
): Promise<bigint> => {
  return await publicClient.readContract({
    ...lilNounsTokenContract,
    functionName: "totalSupply",
  }).then(totalSupply => BigInt(totalSupply) - BigInt(1));
};
