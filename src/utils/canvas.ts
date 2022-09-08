export type Point = { x: number; y: number };

const coordinates = (point: Point) => Object.values(point) as [number, number];

export const drawPixel = (point: Point, color: string, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(...coordinates(point), 1, 1);
};

export const erasePixel = (point: Point, color: string, canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d")!;
  ctx.fillRect(...coordinates(point), 1, 1);
};

export const drawLine = (start: Point, end: Point, color: string, canvas: HTMLCanvasElement) => {
  const xLength = Math.abs(end.x - start.x) + 1;
  const yLength = Math.abs(start.y - end.y) + 1;
  const pixels = Math.floor(Math.max(xLength, yLength));

  for (let i = 0; i <= pixels; i++) {
    const x = Math.floor((start.x * (pixels - i) + end.x * i) / pixels);
    const y = Math.floor((start.y * (pixels - i) + end.y * i) / pixels);
    drawPixel({ x, y }, color, canvas);
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

export const drawCanvas = (source: CanvasImageSource, destinationCanvas: HTMLCanvasElement) => {
  const ctx = destinationCanvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(source, 0, 0, destinationCanvas.width, destinationCanvas.height);
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
