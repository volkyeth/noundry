"use client";

import { nounsDescriptorContract } from "@/contracts/nounsDescriptor";
import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { mainnet } from "wagmi";

export const useMainnetArtwork = () => {
  return useQuery({
    queryKey: ["mainnetArtwork"],
    queryFn: async () => {
      console.log("starting multicall");
      const [
        { result: glassesCount },
        { result: headCount },
        { result: accessoryCount },
        { result: bodyCount },
        { result: backgroundCount },
      ] = await multicall({
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
        chainId: mainnet.id,
      });

      console.log({
        glassesCount,
        headCount,
        accessoryCount,
        bodyCount,
        backgroundCount,
      });

      if (
        !glassesCount ||
        !headCount ||
        !accessoryCount ||
        !bodyCount ||
        !backgroundCount
      ) {
        throw new Error("Unable to fetch artwork counts");
      }

      return {
        glasses: (await multicall({
          contracts: new Array(Number(glassesCount))
            .fill(null)
            .map((_, index) => ({
              ...nounsDescriptorContract,
              functionName: "glasses",
              args: [index],
            })),
          chainId: mainnet.id,
        }).then((results) => results.map(({ result }) => result))) as string[],
      };
    },
  });
};
