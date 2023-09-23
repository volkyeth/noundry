import { Point } from "../../types/geometry";

export const isInside = (canvas: HTMLCanvasElement, point: Point) =>
  point.x >= 0 && point.x < canvas.width && point.y >= 0 && point.y < canvas.height;
