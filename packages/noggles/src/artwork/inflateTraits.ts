import { inflateRaw } from "pako";
import { decodeAbiParameters } from "viem";
import { DeflatedTraitsData, EncodedTrait } from "../types/artwork.js";

export const inflateTraits = (data: DeflatedTraitsData): EncodedTrait[] => {
  const [encodedTraits] = decodeAbiParameters(
    [{ type: "bytes[]" }],
    ("0x" +
      Buffer.from(inflateRaw(Buffer.from(data.slice(2), "hex"))).toString(
        "hex"
      )) as `0x${string}`
  );

  return [...encodedTraits];
};
