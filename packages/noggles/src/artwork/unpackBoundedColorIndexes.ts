import { chunk } from "remeda";
import { TRANSPARENT } from "../constants/artwork.js";
import { BoundedColorIndexes } from "../types/artwork.js";

export const unpackBoundedColorIndexes = (
  boundedColorIndexes: BoundedColorIndexes,
  width: number,
  height: number
): number[] => {
  const {
    bounds: { top, right, bottom, left },
    boundedColorIndexes: colorIndexes,
  } = boundedColorIndexes;

  if (colorIndexes.length === 0)
    return new Array(width * height).fill(TRANSPARENT);

  const emptyRow = () => new Array<number>(width).fill(TRANSPARENT);
  const leftGap = () => new Array<number>(left).fill(TRANSPARENT);
  const rightGap = () => new Array<number>(width - right - 1).fill(TRANSPARENT);
  const boundedRows = chunk(colorIndexes, right - left + 1);
  return [
    ...new Array(top).fill(null).flatMap(() => emptyRow()),
    ...boundedRows.flatMap((boundedRow) => [
      ...leftGap(),
      ...boundedRow,
      ...rightGap(),
    ]),
    ...new Array(height - bottom - 1).fill(null).flatMap(() => emptyRow()),
  ];
};
