import { nounsDaoDataAbi, nounsDaoDataAddress } from "@/contracts/nounsDaoData";
import { useContractRead } from "wagmi";

export const useCreateCandidateCost = () => {
  const { data: cost } = useContractRead({
    abi: nounsDaoDataAbi,
    address: nounsDaoDataAddress,
    functionName: "createCandidateCost",
  });

  return cost;
};
