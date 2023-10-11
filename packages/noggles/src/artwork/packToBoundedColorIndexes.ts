import { TRANSPARENT } from "../constants/artwork.js";
import { BoundedColorIndexes, ColorIndex } from "../types/artwork.js";

export const packToBoundedColorIndexes = (
  colorIndexes: ColorIndex[],
  width: number,
  height: number
): BoundedColorIndexes => {
  let top = height - 1;
  let right = 0;
  let bottom = 0;
  let left = width - 1;
  const rows: number[][] = new Array(height).fill(null).map(() => []);
  for (const [i, colorIndex] of colorIndexes.entries()) {
    const row = Math.floor(i / width);
    const col = i % width;
    const isTransparent = colorIndex === TRANSPARENT;
    rows[row].push(colorIndex);
    if (!isTransparent) {
      top = Math.min(top, row);
      right = Math.max(right, col);
      bottom = Math.max(bottom, row);
      left = Math.min(left, col);
    }
  }
  const boundedColorIndexes = rows
    .slice(top, bottom + 1)
    .flatMap((row) => row.slice(left, right + 1));
  // right bound is calculated to be one pixel outside the content
  right++;
  return {
    bounds: {
      top,
      right,
      bottom,
      left,
    },
    boundedColorIndexes,
  };
};
