import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";
import { nounsDaoAbi } from "./src/abis/NounsDaoAbi";
import { nounsDaoDataAbi } from "./src/abis/NounsDaoData";
import { nounsDaoExecutorAbi } from "./src/abis/NounsDaoExecutor";
import { nounsDescriptorV2Abi } from "./src/abis/NounsDescriptorV2";
import { nounsTokenAbi } from "./src/abis/NounsTokenAbi";
import { zoraNftCreatorAbi } from "./src/abis/ZoraNftCreator";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "NounsToken",
      abi: nounsTokenAbi,
      address: { 1: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03" },
    },
    {
      name: "NounsData",
      abi: nounsDaoDataAbi,
      address: { 1: "0xf790A5f59678dd733fb3De93493A91f472ca1365" },
    },
    {
      name: "NounsExecutor",
      abi: nounsDaoExecutorAbi,
      address: { 1: "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71" },
    },
    {
      name: "NounsDAO",
      abi: nounsDaoAbi,
      address: { 1: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d" },
    },
    {
      name: "NounsDescriptor",
      abi: nounsDescriptorV2Abi,
      address: { 1: "0x6229c811D04501523C6058bfAAc29c91bb586268" },
    },
    {
      name: "ZoraNftCreator",
      abi: zoraNftCreatorAbi,
      address: { 1: "0xF74B146ce44CC162b601deC3BE331784DB111DC1" },
    },
  ],
  plugins: [
    actions(),
    react({
      useContractFunctionRead: true,
      useContractFunctionWrite: true,
      usePrepareContractFunctionWrite: true,
    }),
  ],
});
