import { Point } from "../../types/geometry";

export const getPaintedPixels = (canvas: HTMLCanvasElement): Point[] => {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const nonTransparentPixels = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha > 0) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);
      nonTransparentPixels.push({ x, y });
    }
  }
  return nonTransparentPixels;
};
