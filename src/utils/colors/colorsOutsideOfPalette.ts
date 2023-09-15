import { Colord } from "colord";
import { belongsToPalette } from "./belongsToPalette";

export const colorsOutsideOfPalette = (colors: Colord[], palette: Colord[]) => colors.filter((c) => !belongsToPalette(c, palette));
