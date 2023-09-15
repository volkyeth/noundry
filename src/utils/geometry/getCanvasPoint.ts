import { Point } from "../../types/geometry";

// convert the point from a mouse pointer event to a point on the canvas

export const getCanvasPoint = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, canvas: HTMLCanvasElement): Point => {
  const canvasRect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(((event.clientX - canvasRect.left) * canvas.width) / canvasRect.width),
    y: Math.floor(((event.clientY - canvasRect.top) * canvas.height) / canvasRect.height),
  };
};
