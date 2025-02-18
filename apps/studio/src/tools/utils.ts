import { useSelection } from "../model/Selection";
import { Point } from "../types/geometry";
import { withClip } from "../utils/canvas";

export const getBoundingBoxIncludingBrush = (points: Point[], brushSize: number) => {
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const xValues = [startPoint.x, startPoint.x - brushSize + 1, endPoint.x, endPoint.x - brushSize + 1];
  const startX = Math.min(...xValues);
  const endX = Math.max(...xValues);
  const yValues = [startPoint.y, startPoint.y - brushSize + 1, endPoint.y, endPoint.y - brushSize + 1];
  const startY = Math.min(...yValues);
  const endY = Math.max(...yValues);

  return { start: { x: startX, y: startY }, end: { x: endX, y: endY } };
};

export const getBoundingBox = (points: Point[]) => {
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  const xValues = [startPoint.x, startPoint.x, endPoint.x, endPoint.x];
  const x0 = Math.min(...xValues);
  const x1 = Math.max(...xValues);
  const yValues = [startPoint.y, startPoint.y, endPoint.y, endPoint.y];
  const y0 = Math.min(...yValues);
  const y1 = Math.max(...yValues);

  return { x0: x0, y0: y0, x1: x1, y1: y1 };
};

export const withSelectionClip = (ctx: CanvasRenderingContext2D, fn: () => void) => {
  const { selectedPoints } = useSelection.getState();

  if (selectedPoints.length === 0) {
    fn();
  }

  return withClip(ctx, selectedPoints, fn);
};

export const inCanvas = (point: Point, ctx: CanvasRenderingContext2D) =>
  point.x >= 0 && point.x < ctx.canvas.width && point.y >= 0 && point.y < ctx.canvas.height; 