import { Point } from "../types/geometry";
import { getBoundingBox } from "./utils";

export const ellipse = (
  points: Point[], 
  brushSize: number, 
  fill: boolean, 
  fillRect: (x: number, y: number, w: number, h: number) => void
) => {
  const coords = getBoundingBox(points);

  let xC = Math.round((coords.x0 + coords.x1) / 2);
  let yC = Math.round((coords.y0 + coords.y1) / 2);
  let evenX = (coords.x0 + coords.x1) % 2;
  let evenY = (coords.y0 + coords.y1) % 2;
  let rX = coords.x1 - xC;
  let rY = coords.y1 - yC;

  let x;
  let y;
  let angle;
  let r;

  //inner ellipse axis
  let iX = fill ? 0 : Math.max(rX - brushSize, 0);
  let iY = fill ? 0 : Math.max(rY - brushSize, 0);

  // iterate over a quadrant pixels
  for (x = 0; x <= rX; x++) {
    for (y = 0; y <= rY; y++) {
      angle = Math.atan(y / x);
      r = Math.sqrt(x * x + y * y);
      if (
        (fill ||
          rX <= brushSize ||
          rY <= brushSize ||
          r > (iX * iY) / Math.sqrt(iY * iY * Math.pow(Math.cos(angle), 2) + iX * iX * Math.pow(Math.sin(angle), 2)) + 0.5) &&
        r < (rX * rY) / Math.sqrt(rY * rY * Math.pow(Math.cos(angle), 2) + rX * rX * Math.pow(Math.sin(angle), 2)) + 0.5
      ) {
        // fill pixels in all quadrants
        fillRect(xC + x, yC + y, 1, 1);
        fillRect(xC - x - evenX, yC + y, 1, 1);
        fillRect(xC + x, yC - y - evenY, 1, 1);
        fillRect(xC - x - evenX, yC - y - evenY, 1, 1);
      }
    }
  }
}; 