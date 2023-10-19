import { encodeFunctionData, getAbiItem, maxUint64, zeroAddress } from "viem";

import { nounsDaoExecutorAddress } from "../../constants/contracts/nounsDaoExecutor";
import {
  zoraNftCreatorAbi,
  zoraNftCreatorAddress,
} from "../../constants/contracts/zoraNftCreator";
import { NounPartType } from "../../types/noun";
import { Transaction } from "../../types/proposal";
import { getFunctionSignature } from "./getFunctionSignature";

export const getZoraEditionTransaction = (
  partType: NounPartType,
  partName: string,
  artistAddress: `0x${string}`,
  droposalMediaUri: string,
  publicSaleStart: bigint,
  publicSaleEnd: bigint
): Transaction => {
  const name = `Noundry edition: ${partName} ${partType}`;
  const symbol = `NOUNDRY`;
  const editionSize = maxUint64;
  const royaltyBPS = 0;
  const fundsRecipient = artistAddress;
  const defaultAdmin = nounsDaoExecutorAddress;
  const publicSalePrice = 0n;
  const maxSalePurchasePerAddress = 0;
  const presaleStart = 0n;
  const presaleEnd = 0n;
  const presaleMerkleRoot =
    "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`;
  const salesConfig = {
    publicSalePrice,
    maxSalePurchasePerAddress,
    publicSaleStart,
    publicSaleEnd,
    presaleStart,
    presaleEnd,
    presaleMerkleRoot,
  };
  const description = `This is a commemorative edition of the new ${partName} ${partType} added to Nouns.`;
  const animationURI = "";
  const imageURI = droposalMediaUri;
  const createReferral =
    import.meta.env.VITE_CREATE_REFERRAL_ADDRESS || zeroAddress;

  const target = zoraNftCreatorAddress;
  const calldata = ("0x" +
    encodeFunctionData({
      abi: zoraNftCreatorAbi,
      functionName: "createEditionWithReferral",
      args: [
        name,
        symbol,
        editionSize,
        royaltyBPS,
        fundsRecipient,
        defaultAdmin,
        salesConfig,
        description,
        animationURI,
        imageURI,
        createReferral,
      ],
    }).substring(10)) as `0x${string}`;

  const signature = getFunctionSignature(
    getAbiItem({ abi: zoraNftCreatorAbi, name: "createEditionWithReferral" })
  );
  const value = 0n;

  return { target, calldata, signature, value };
};
