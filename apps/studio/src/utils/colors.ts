import { ImageData } from "@noundry/nouns-assets";
import { Colord, colord, extend } from "colord";
import labPlugin from "colord/plugins/lab";
import { some, sortBy, uniq } from "lodash";
import { getPixels } from "./canvas/getPixels";

extend([labPlugin]);

export const sortedPalette = () => {
  return nounsClassicPalette.sort(sortColors).map((color) => colord(color).toHex());
};

export const nounsClassicPalette = ["00000000", ...ImageData.palette.slice(1)].map((color) => colord(`#${color}`));

export const offPalette = (color: Colord) => {
  return !some(nounsClassicPalette, (c) => c.isEqual(color));
};

export const getClosestPaletteColors = (color: Colord, amount: number) => {
  return sortBy(nounsClassicPalette.slice(1), (c) => c.delta(color))!.slice(0, amount);
};

const sortColors = (colorA: Colord, colorB: Colord) => {
  const hslColorA = colorA.toHsl();
  const hslColorB = colorB.toHsl();
  // Move grey-ish values to the back
  if ((hslColorA.s === 0 || hslColorB.s === 0) && hslColorA.s !== hslColorB.s) {
    return hslColorA.s - hslColorB.s;
  }

  // Sort by hue (lowest first)
  if (hslColorA.h !== hslColorB.h) {
    return hslColorA.h - hslColorB.h;
  }

  // Sort by saturation (highest first)
  if (hslColorA.s !== hslColorB.s) {
    return hslColorA.s - hslColorB.s;
  }

  // Comparing gray values, light before dark
  if (hslColorA.s === 0 && hslColorB.s === 0) {
    if (hslColorA.l !== hslColorB.l) {
      return hslColorB.l - hslColorA.l;
    }
  }

  return 0;
};

export type ColorSubstitutions = {
  [offPaletteColor: string]: string;
};

export type ColorSubstitutionCandidates = {
  [offPaletteColor: string]: string[];
};

export const getColorSubstitutionCandidates = (canvas: HTMLCanvasElement, amount: number): ColorSubstitutionCandidates => {
  const palette = uniq(getPixels(canvas));

  const offPaletteColors = palette.map(colord).filter(offPalette);

  if (offPaletteColors.length === 0) {
    return {};
  }

  return offPaletteColors.reduce(
    (substitutes, color) => ({
      ...substitutes,
      [color.toHex()]: getClosestPaletteColors(color, amount).map((c) => c.toHex()),
    }),
    {} as ColorSubstitutionCandidates
  );
};

export const applyColorSubstitutions = (pixels: Colord[], substitutions: ColorSubstitutions) => {
  const colorsToSubstitute = Object.keys(substitutions);

  return pixels
    .map((c) => c.toHex())
    .map((color) => (colorsToSubstitute.includes(color) ? substitutions[color] : color))
    .map(colord);
};

export const setImageDataFromPixels = (canvas: HTMLCanvasElement, pixels: Colord[]) => {
  const ctx = canvas.getContext("2d")!;
  const data = pixels.map((color) => color.toRgb()).flatMap(({ r, g, b, a }) => [r, g, b, Math.floor(255 * a)]);

  const updatedImageData = ctx.createImageData(canvas.width, canvas.height);

  updatedImageData.data.set(Uint8ClampedArray.from(data));

  ctx.putImageData(updatedImageData, 0, 0);
};
