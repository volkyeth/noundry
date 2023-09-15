export const scaleCanvas = (canvas: HTMLCanvasElement, scale: number) => {
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
};
