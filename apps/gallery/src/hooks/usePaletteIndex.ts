import { HexColor, Palette } from "noggles";

export const usePaletteIndex = (
  traitColors?: HexColor[],
  palettes?: Palette[]
) => {
  if (!traitColors || !palettes) return undefined;

  for (let i = 0; i < palettes.length; i++) {
    const palette = palettes[i];
    if (traitColors.every((color) => palette.includes(color))) return i;
  }

  return null;
};
