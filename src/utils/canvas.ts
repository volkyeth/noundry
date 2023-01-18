import { useMemo, useState } from "react";

export type Point = { x: number; y: number };

export type Matrix = { [x: number]: { [y: number]: true } };

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
    ctx.fillRect(x0 - brushSize + 1, y0 - brushSize + 1, brushSize, brushSize);

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

export const fillCanvas = (canvas: HTMLCanvasElement, color: string) => {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

export const clearCanvas = (canvas: HTMLCanvasElement) => {
  canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
};

export const drawCanvas = (source: CanvasImageSource, destinationCanvas: HTMLCanvasElement, dx: number = 0, dy: number = 0) => {
  const ctx = destinationCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, dx, dy, destinationCanvas.width, destinationCanvas.height);
};

export const replaceCanvas = (source: CanvasImageSource, destinationCanvas: HTMLCanvasElement) => {
  clearCanvas(destinationCanvas);
  drawCanvas(source, destinationCanvas);
};

export const getBlob = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject("Couldn't create blob");
        return;
      }

      resolve(blob);
    });
  });

// convert the point from a mouse pointer event to a point on the canvas
export const canvasPoint = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, canvas: HTMLCanvasElement): Point => {
  const canvasRect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(((event.clientX - canvasRect.left) * canvas.width) / canvasRect.width),
    y: Math.floor(((event.clientY - canvasRect.top) * canvas.height) / canvasRect.height),
  };
};

export const replaceCanvasWithBlob = (blob: Blob, canvas: HTMLCanvasElement) => {
  const img = new Image();
  const ctx = canvas.getContext("2d")!;

  return new Promise<void>((resolve) => {
    img.src = URL.createObjectURL(blob);
    img.onload = () => {
      clearCanvas(canvas);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };
  });
};

export const scaleCanvas = (canvas: HTMLCanvasElement, scale: number) => {
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
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

export const getNonTransparentPixels = (canvas: HTMLCanvasElement): Point[] => {
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const nonTransparentPixels = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const alpha = pixels[i + 3];
    if (alpha > 0) {
      const x = (i / 4) % canvas.width;
      const y = Math.floor(i / 4 / canvas.width);
      nonTransparentPixels.push({ x, y });
    }
  }
  return nonTransparentPixels;
};

export const insideCanvas = (canvas: HTMLCanvasElement, point: Point) =>
  point.x >= 0 && point.x < canvas.width && point.y >= 0 && point.y < canvas.height;

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
