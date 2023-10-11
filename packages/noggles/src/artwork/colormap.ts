import { colord } from "colord";
import { IndexedColorTrait, Palette, RawTrait } from "../types/artwork.js";

export const colormap = (
  { width, height, colorIndexes }: IndexedColorTrait,
  palette: Palette
): RawTrait => ({
  width,
  height,
  data: new Uint8ClampedArray(
    colorIndexes.flatMap((colorIndex) => {
      const color = palette[colorIndex];
      if (!color) throw new Error(`Color index ${colorIndex} is out of bounds`);

      const { r, g, b, a } = colord(color).rgba;
      return [r, g, b, a * 255];
    })
  ),
});
