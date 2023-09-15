import { Colord } from "colord";
import { sortBy } from "lodash";

export const kNearestPaletteColors = (color: Colord, palette: Colord[], k: number) => {
  return sortBy(palette, (c) => c.delta(color))!.slice(0, k);
};
