import { colord, Colord } from "colord";
import { IoColorFill } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { Point } from "../types/geometry";
import { erasePixel, paintPixel } from "../utils/canvas";
import { getPixelColor } from "../utils/canvas/getPixelColor";
import { Tool } from "./types";
import { inCanvas } from "./utils";

export const Bucket = (): Tool => ({
  apply: (points, canvas) => {
    const ctx = canvas.getContext("2d")!;
    const { fillColor: color } = useBrush.getState();

    const lastPoint = points[points.length - 1];
    const fillColor = colord(color);

    ctx.fillStyle = color;

    // withSelectionClip(ctx, () => {
    floodFill(ctx, lastPoint, fillColor);
    // });
  },
  name: "Bucket",
  icon: IoColorFill,
  shortcut: "G",
});

const floodFill = (ctx: CanvasRenderingContext2D, point: Point, fillColor: Colord, searchColor?: Colord) => {
  if (!inCanvas(point, ctx)) {
    return;
  }

  const color = getPixelColor(point, ctx);

  if (color.isEqual(fillColor) || (searchColor && !color.isEqual(searchColor))) {
    return;
  }

  erasePixel(point, ctx);
  paintPixel(point, ctx);

  floodFill(ctx, { ...point, x: point.x - 1 }, fillColor, searchColor ?? color);
  floodFill(ctx, { ...point, x: point.x + 1 }, fillColor, searchColor ?? color);
  floodFill(ctx, { ...point, y: point.y - 1 }, fillColor, searchColor ?? color);
  floodFill(ctx, { ...point, y: point.y + 1 }, fillColor, searchColor ?? color);
}; 