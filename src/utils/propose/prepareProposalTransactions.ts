import { encodeFunctionData, maxUint64 } from "viem";
import { mainnet } from "wagmi";
import { zoraNftCreatorABI, zoraNftCreatorAddress } from "../../generated";
import { NounPartType } from "../../types/noun";
import { getPixels } from "../canvas/getPixels";
import { paletteLookup, rleEncode } from "../artworkEncoding";

const prepareProposalTransactions = async (part: NounPartType, partName: string, partCanvas: HTMLCanvasElement) => {};

const encodeArtworkCall = (part: NounPartType, partCanvas: HTMLCanvasElement) => {};

const encodeDroposalCall = (part: NounPartType, partName: string) => {
  const name = `Noundry commemorative edition: ${partName}`;
  const symbol = `NOUNDRY`;
  const editionSize = maxUint64;
  const royaltyBPS = 0;
  const fundsRecipient = "0x0";
  const defaultAdmin = "0x0";
  const publicSalePrice = 0n;
  const maxSalePurchasePerAddress = 0;
  const publicSaleStart = 0n;
  const publicSaleEnd = 0n;
  const presaleStart = 0n;
  const presaleEnd = 0n;
  const presaleMerkleRoot = "0x0" as `0x${string}`;
  const salesConfig = { publicSalePrice, maxSalePurchasePerAddress, publicSaleStart, publicSaleEnd, presaleStart, presaleEnd, presaleMerkleRoot };
  const description = `This is a commemorative edition of the new ${part} trait: ${partName} added to Nouns.`;
  const animationURI = "";
  const imageURI = "";
  const createReferral = "0x0";

  const target = zoraNftCreatorAddress[mainnet.id];
  const calldata =
    "0x" +
    encodeFunctionData({
      abi: zoraNftCreatorABI,
      functionName: "createEditionWithReferral",
      args: [name, symbol, editionSize, royaltyBPS, fundsRecipient, defaultAdmin, salesConfig, description, animationURI, imageURI, createReferral],
    }).substring(10);

  const signature =
    "createEditionWithReferral(string,string,uint64,uint16,address,address,(uint104,uint32,uint64,uint64,uint64,uint64,bytes32),string,string,string,address)";
  const value = 0n;

  return { target, calldata, signature, value };
};

const rleEncodePart = (partCanvas: HTMLCanvasElement) => {
  const pixels = getPixels(partCanvas);
  const rleEncodedPixels = rleEncode(pixels.map((pixel) => (pixel.alpha() === 0 ? 0 : paletteLookup[pixel.toHex().toLocaleLowerCase()])));
  console.log(rleEncodedPixels);
};
