import { Colord } from "colord";
import { some } from "lodash";
import { nounsClassicPalette } from "../colors";

export const belongsToPalette = (color: Colord, palette: Colord[]) => some(nounsClassicPalette, (c) => c.isEqual(color));
