import { toHexByte } from "./toHexByte.js";

export const rleEncode = (boundedColorIndexes: number[]) => {
  const encoding: string[] = [];
  let previousColorIndex = boundedColorIndexes[0];
  let colorStreakCount = 1;
  for (let i = 1; i < boundedColorIndexes.length; i++) {
    if (
      boundedColorIndexes[i] !== previousColorIndex ||
      colorStreakCount === 255
    ) {
      encoding.push(toHexByte(colorStreakCount), toHexByte(previousColorIndex));
      colorStreakCount = 1;
      previousColorIndex = boundedColorIndexes[i];
    } else {
      colorStreakCount++;
    }
  }
  if (previousColorIndex !== undefined) {
    encoding.push(toHexByte(colorStreakCount), toHexByte(previousColorIndex));
  }
  return encoding.join("");
};
