import { PngDataUri } from "@/types/image";
import { EncodedTrait, HexColor } from "noggles";
import {
  TRANSPARENT_HEX
} from "noggles/src/constants/artwork";
import { useMemo } from "react";
import { useTraitBitmap } from "./useTraitBitmap";

export const useTraitColors = (trait: PngDataUri | EncodedTrait | ImageBitmap | null): HexColor[] | undefined => {
  const traitBitmap = useTraitBitmap(trait);
  return useMemo(() => {
    if (!traitBitmap) return undefined;

    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(traitBitmap, 0, 0, 32, 32);
    const imageData = ctx.getImageData(0, 0, 32, 32);
    const traitColors = [
      ...new Set(
        Array.from(
          { length: 32 * 32 },
          (_, i) =>
            [
              imageData.data[i * 4],
              imageData.data[i * 4 + 1],
              imageData.data[i * 4 + 2],
              imageData.data[i * 4 + 3],
            ] as [number, number, number, number]
        ).map(rgbaToHex)
      ),
    ];

    return traitColors;
  }, [traitBitmap]);
};

const rgbaToHex = ([r, g, b, a]: [
  number,
  number,
  number,
  number,
]): HexColor => {
  if (a === 0) return TRANSPARENT_HEX;

  return `#${[r, g, b].map(decimalToHex).join("")}`;
};

const decimalToHex = (decimal: number) => {
  return decimal.toString(16).padStart(2, "0");
};
