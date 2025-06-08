import { clearCanvas } from "./clearCanvas";

export const replaceCanvasWithImageData = (imageData: ImageData, canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d")!;
  clearCanvas(canvas);
  ctx.putImageData(imageData, 0, 0);
};