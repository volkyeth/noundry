import { useMemo, useState } from "react";
import { Point } from "../types/geometry";

const coordinates = (point: Point) => Object.values(point) as [number, number];

export const drawPixel = (point: Point, color: string, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(...coordinates(point), 1, 1);
};

export const paintPixel = (point: Point, ctx: CanvasRenderingContext2D) => ctx.fillRect(point.x, point.y, 1, 1);

export const erasePixel = (point: Point, ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(...coordinates(point), 1, 1);
};

// Uses Bresenham's line algorithm
export const drawLine = (start: Point, end: Point, color: string, brushSize: number, ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = color;

  var x0 = start.x;
  var y0 = start.y;
  var dx = Math.abs(end.x - x0);
  var dy = Math.abs(end.y - y0);
  var sx = x0 < end.x ? 1 : -1;
  var sy = y0 < end.y ? 1 : -1;
  var err = dx - dy;

  while (true) {
    if (color === "#00000000") {
      ctx.clearRect(x0 - brushSize + 1, y0 - brushSize + 1, brushSize, brushSize);
    } else {
      ctx.fillRect(x0 - brushSize + 1, y0 - brushSize + 1, brushSize, brushSize);
    }

    if (x0 === end.x && y0 === end.y) break;
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
};

export const useOffscreenCanvas = () => {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    return canvas;
  }, []);
};

export const useCanvasInitializer = (initialize: (canvas: HTMLCanvasElement) => void) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = (canvas: HTMLCanvasElement | null) => {
    setCanvas(canvas);

    if (!canvas) return;

    initialize(canvas);
  };

  return { canvas, canvasRef };
};

export const applyClip = (ctx: CanvasRenderingContext2D, points: Point[]) => {
  const clipPath = new Path2D();
  points.forEach((point) => clipPath.rect(point.x, point.y, 1, 1));
  ctx.clip(clipPath);
};

export const withClip = (ctx: CanvasRenderingContext2D, points: Point[], fn: () => void) => {
  ctx.save();
  applyClip(ctx, points);
  fn();
  ctx.restore();
};

export const toString = (point: Point) => `${point.x},${point.y}`;

export const getBoundingRect = (points: Point[]) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
};
