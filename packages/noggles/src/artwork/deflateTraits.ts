import { deflateRaw } from "pako";
import { encodeAbiParameters } from "viem";
import { DeflatedTraits, EncodedTrait } from "../types/artwork.js";

export const deflateTraits = (
  encodedTraits: EncodedTrait[]
): DeflatedTraits => {
  const abiEncodedArtwork = encodeAbiParameters(
    [{ type: "bytes[]" }],
    [encodedTraits]
  );
  const data = ("0x" +
    Buffer.from(
      deflateRaw(Buffer.from(abiEncodedArtwork.substring(2), "hex"))
    ).toString("hex")) as `0x${string}`;
  const originalLength = BigInt(abiEncodedArtwork.substring(2).length / 2);
  const traitCount = encodedTraits.length;

  return { data, originalLength, traitCount };
};
