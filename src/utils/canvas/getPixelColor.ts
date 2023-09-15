import { colord } from "colord";
import { Point } from "../../types/geometry";

export const getPixelColor = (point: Point, ctx: CanvasRenderingContext2D) => {
  const [r, g, b, a] = ctx.getImageData(point.x, point.y, 1, 1).data;
  return colord({ r, g, b, a });
};
