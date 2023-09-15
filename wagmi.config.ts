import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { nounsDaoDataAbi } from "./src/abis/nounsDaoData";
import { zoraNftCreatorAbi } from "./src/abis/zoraNftCreator";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "NounsDaoData",
      abi: nounsDaoDataAbi,
      address: { 1: "0xf790A5f59678dd733fb3De93493A91f472ca1365" },
    },
    {
      name: "ZoraNftCreator",
      abi: zoraNftCreatorAbi,
      address: { 1: "0xF74B146ce44CC162b601deC3BE331784DB111DC1" },
    },
  ],
  plugins: [react({ useContractFunctionWrite: true })],
});
