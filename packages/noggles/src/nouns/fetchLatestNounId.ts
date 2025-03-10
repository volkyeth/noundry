import { PublicClient } from "viem";
import { nounsTokenContract } from "./contracts/nouns-token.js";

export const fetchLatestNounId = async (
  publicClient: PublicClient
): Promise<bigint> => {
  return await publicClient.readContract({
    ...nounsTokenContract,
    functionName: "totalSupply",
  }).then(totalSupply => BigInt(totalSupply) - BigInt(1));
};
