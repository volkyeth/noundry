import { ImageData } from "@nouns/assets";
import { Colord, colord, HslaColor } from "colord";
import { HsvaColor } from "react-colorful";

export const sortedPalette = () => {
  const { palette } = ImageData;
  return palette
    .filter((color) => !!color)
    .map((color) => colord(`#${color}`).toHsl())
    .sort(sortColors)
    .map((color) => colord(color).toHex());
};

const sortColors = (colorA: HslaColor, colorB: HslaColor) => {
  // Move grey-ish values to the back
  if ((colorA.s === 0 || colorB.s === 0) && colorA.s !== colorB.s) {
    return colorA.s - colorB.s;
  }

  // Sort by hue (lowest first)
  if (colorA.h !== colorB.h) {
    return colorA.h - colorB.h;
  }

  // Sort by saturation (highest first)
  if (colorA.s !== colorB.s) {
    return colorA.s - colorB.s;
  }

  // Comparing gray values, light before dark
  if (colorA.s === 0 && colorB.s === 0) {
    if (colorA.l !== colorB.l) {
      return colorB.l - colorA.l;
    }
  }

  return 0;
};
