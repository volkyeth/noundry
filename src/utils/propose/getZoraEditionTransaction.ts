import { encodeFunctionData, getAbiItem, maxUint64, zeroAddress } from "viem";
import { mainnet } from "wagmi";
import {
  nounsExecutorAddress,
  zoraNftCreatorABI,
  zoraNftCreatorAddress,
} from "../../generated";
import { NounPartType } from "../../types/noun";
import { Transaction } from "../../types/proposal";
import { getFunctionSignature } from "./getFunctionSignature";

export const getZoraEditionTransaction = (
  partType: NounPartType,
  partName: string,
  artistAddress: `0x${string}`,
  droposalMediaUri: string,
  estimatedExecutionDelay: bigint
): Transaction => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const oneWeek = 604_800n;

  const name = `Noundry edition: ${partName} ${partType}`;
  const symbol = `NOUNDRY`;
  const editionSize = maxUint64;
  const royaltyBPS = 0;
  const fundsRecipient = artistAddress;
  const defaultAdmin = nounsExecutorAddress[mainnet.id];
  const publicSalePrice = 0n;
  const maxSalePurchasePerAddress = 0;
  const publicSaleStart = now + estimatedExecutionDelay;
  const publicSaleEnd = publicSaleStart + oneWeek;
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

  const target = zoraNftCreatorAddress[mainnet.id];
  const calldata = ("0x" +
    encodeFunctionData({
      abi: zoraNftCreatorABI,
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
    getAbiItem({ abi: zoraNftCreatorABI, name: "createEditionWithReferral" })
  );
  const value = 0n;

  return { target, calldata, signature, value };
};
