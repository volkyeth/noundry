import { clearCanvas } from "./clearCanvas";

export const replaceCanvasWithBlob = (blob: Blob, canvas: HTMLCanvasElement) => {
  const img = new Image();
  const ctx = canvas.getContext("2d")!;

  return new Promise<void>((resolve) => {
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      clearCanvas(canvas);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };
  });
};
