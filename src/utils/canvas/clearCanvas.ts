export const clearCanvas = (canvas: HTMLCanvasElement) => {
  canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
};
