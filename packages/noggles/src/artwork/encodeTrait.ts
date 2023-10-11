import { ColorIndex } from "../index.js";
import { packToBoundedColorIndexes } from "./packToBoundedColorIndexes.js";
import { rleEncode } from "./rleEncode.js";
import { toHexByte } from "./toHexByte.js";

export const encodeTrait = (
  height: number,
  width: number,
  colorIndexes: ColorIndex[],
  paletteIndex: number
): `0x${string}` => {
  const {
    bounds: { top, right, bottom, left },
    boundedColorIndexes,
  } = packToBoundedColorIndexes(colorIndexes, width, height);
  const metadata = [paletteIndex, top, right, bottom, left].map((v) =>
    toHexByte(v)
  );
  return `0x${metadata.join("")}${rleEncode(boundedColorIndexes)}`;
};
