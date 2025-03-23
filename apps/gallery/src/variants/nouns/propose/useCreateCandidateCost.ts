import { nounsDaoDataContract } from "noggles";
import { useReadContract } from "wagmi";

export const useCreateCandidateCost = () => {
  const { data: cost } = useReadContract({
    ...nounsDaoDataContract,
    functionName: "createCandidateCost",
  });

  return cost;
};
