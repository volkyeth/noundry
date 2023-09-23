import { clearCanvas } from "./clearCanvas";
import { drawCanvas } from "./drawCanvas";

export const replaceCanvas = (source: CanvasImageSource, destinationCanvas: HTMLCanvasElement) => {
  clearCanvas(destinationCanvas);
  drawCanvas(source, destinationCanvas);
};
