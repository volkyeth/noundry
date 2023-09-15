export const fillCanvas = (canvas: HTMLCanvasElement, color: string) => {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
