export const drawCanvas = (source: CanvasImageSource, destinationCanvas: HTMLCanvasElement, dx: number = 0, dy: number = 0) => {
  const ctx = destinationCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, dx, dy, destinationCanvas.width, destinationCanvas.height);
};
