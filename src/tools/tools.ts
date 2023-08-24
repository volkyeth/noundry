import { Colord } from "colord";
import { IconType } from "react-icons";
import { BsSlash } from "react-icons/bs";
import { IoColorFill, IoEllipseOutline, IoSquareOutline } from "react-icons/io5";
import { RiDragMove2Line, RiEraserFill, RiPencilFill, RiSipFill } from "react-icons/ri";
import { TbCircleDashed, TbMarquee } from "react-icons/tb";
import { useBrushState } from "../state/brushState";
import { useClipboardState } from "../state/clipboardState";
import { NounPartState } from "../state/nounPartState";
import { useSelectionState } from "../state/selectionState";
import { Point, clearCanvas, drawCanvas, drawLine, erasePixel, insideCanvas, paintPixel, replaceCanvas, withClip } from "../utils/canvas";
import { getPixelColor } from "../utils/colors";

export type ToolAction = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => void;

export type Tool = {
  apply: ToolAction;
  begin?: ToolAction;
  finalize?: ToolAction;
  name: string;
  icon: IconType;
};

export const defaultFinalize = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  partState.commit();
};

export type Color = string;

export const Pen = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, brushSize } = useBrushState.getState();

    const ctx = canvas.getContext("2d")!;
    console.log("pen");
    withSelectionClip(ctx, () => {
      for (let i = 0; i < points.length; i++) {
        drawLine(points[i === 0 ? 0 : i - 1], points[i], fgColor, brushSize, ctx);
      }
    });
  },
  name: "Pen",
  icon: RiPencilFill,
});

export const Move = (): Tool => ({
  apply: (points, workingCanvas, partState) => {
    const startPoint = points[0];

    const { placing, offsetPlacing } = useClipboardState.getState();
    if (placing) {
      const xOffset = points[points.length - 1].x - points[points.length - 2]?.x ?? points[points.length - 1].x;
      const yOffset = points[points.length - 1].y - points[points.length - 2]?.y ?? points[points.length - 1].y;
      offsetPlacing(xOffset, yOffset);
      return;
    }

    const xOffset = points[points.length - 1].x - startPoint.x;
    const yOffset = points[points.length - 1].y - startPoint.y;
    clearCanvas(workingCanvas);
    drawCanvas(partState.canvas, workingCanvas, xOffset, yOffset);
  },
  begin: (points, workingCanvas, partState) => {
    const { hasSelection, clearSelection } = useSelectionState.getState();
    const { placeFromSelection, placingCanvas } = useClipboardState.getState();
    if (hasSelection()) {
      console.log("placing from selection");
      const ctx = workingCanvas.getContext("2d")!;
      placeFromSelection(workingCanvas);
      withSelectionClip(ctx, () => {
        clearCanvas(workingCanvas);
      });
      replaceCanvas(workingCanvas, partState.canvas);
      partState.commit();
      clearSelection();
      return;
    }
  },
  finalize: (points, workingCanvas, partState) => {
    const { placing } = useClipboardState.getState();
    if (placing) {
      console.log("still placing");
      return;
    }
    partState.commit();
  },
  name: "Move",
  icon: RiDragMove2Line,
});

export const Line = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, brushSize } = useBrushState.getState();

    const ctx = canvas.getContext("2d")!;
    withSelectionClip(ctx, () => {
      drawLine(points[points.length > 1 ? 1 : 0], points[Math.max(0, points.length - 2)], fgColor, brushSize, ctx);
    });
  },
  name: "Line",
  icon: BsSlash,
});

export const Rectangle = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, bgColor, brushSize } = useBrushState.getState();

    const { start, end } = getBoundingBoxIncludingBrush(points, brushSize);

    const width = end.x - start.x + 1;
    const height = end.y - start.y + 1;

    const ctx = canvas.getContext("2d")!;

    withSelectionClip(ctx, () => {
      ctx.fillStyle = bgColor;
      ctx.fillRect(start.x, start.y, width, height);

      ctx.fillStyle = fgColor;
      ctx.fillRect(start.x, start.y, width, brushSize);
      ctx.fillRect(end.x + 1, end.y + 1, -width, -brushSize);
      ctx.fillRect(start.x, start.y, brushSize, height);
      ctx.fillRect(end.x + 1, end.y + 1, -brushSize, -height);
    });
  },
  name: "Rectangle",
  icon: IoSquareOutline,
});

export const RectangularSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { setRectSelection } = useSelectionState.getState();

    const start = points[0];
    const end = points[points.length - 1];

    if (!insideCanvas(canvas, start) && !insideCanvas(canvas, end)) {
      return;
    }

    setRectSelection(start, end);
  },
  name: "Rectangular Selection",
  icon: TbMarquee,
});

export const CircularSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { clearSelection, addRectSelection } = useSelectionState.getState();
    clearSelection();
    ellipse(points, 1, true, (x, y, w, h) => addRectSelection({ x, y }, { x: x + w, y: y + h }));
  },
  name: "Elliptical Selection",
  icon: TbCircleDashed,
});

export const Ellipse = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, bgColor, brushSize } = useBrushState.getState();
    const ctx = canvas.getContext("2d")!;
    const fill = true;

    withSelectionClip(ctx, () => {
      ctx.fillStyle = bgColor;
      drawEllipse(points, brushSize, ctx, fill);
      ctx.fillStyle = fgColor;
      drawEllipse(points, brushSize, ctx, !fill);
    });
  },
  name: "Ellipse",
  icon: IoEllipseOutline,
});

export const Eraser = (): Tool => ({
  apply: (points, canvas) => {
    const { brushSize } = useBrushState.getState();
    const ctx = canvas.getContext("2d")!;
    withSelectionClip(ctx, () => {
      for (let i = 0; i < points.length; i++) {
        ctx.clearRect(points[i].x - brushSize + 1, points[i].y - brushSize + 1, brushSize, brushSize);
      }
    });
  },
  name: "Eraser",
  icon: RiEraserFill,
});

export const Eyedropper = (): Tool => ({
  apply: (points, canvas) => {
    const ctx = canvas.getContext("2d")!;
    const lastPoint = points[points.length - 1];
    const [r, g, b, a] = ctx.getImageData(lastPoint.x, lastPoint.y, 1, 1).data;

    const color = [r, g, b, a].map((i) => i.toString(16).padStart(2, "0")).join("");

    const { setFgColor } = useBrushState.getState();
    if (color === "00000000") {
      return;
    }
    setFgColor(`#${color}`);
  },
  name: "Eyedropper",
  icon: RiSipFill,
});

export const Bucket = (): Tool => ({
  apply: (points, canvas) => {
    const ctx = canvas.getContext("2d")!;
    const { fgColor } = useBrushState.getState();
    ctx.fillStyle = fgColor;

    const lastPoint = points[points.length - 1];

    withSelectionClip(ctx, () => {
      floodFill(ctx, lastPoint);
    });
  },
  name: "Bucket",
  icon: IoColorFill,
});

const floodFill = (ctx: CanvasRenderingContext2D, point: Point, searchColor?: Colord) => {
  if (!inCanvas(point, ctx)) {
    return;
  }

  const color = getPixelColor(point, ctx);

  if (searchColor && !color.isEqual(searchColor)) {
    return;
  }

  erasePixel(point, ctx);
  paintPixel(point, ctx);

  floodFill(ctx, { ...point, x: point.x - 1 }, color);
  floodFill(ctx, { ...point, x: point.x + 1 }, color);
  floodFill(ctx, { ...point, y: point.y - 1 }, color);
  floodFill(ctx, { ...point, y: point.y + 1 }, color);
};

const inCanvas = (point: Point, ctx: CanvasRenderingContext2D) =>
  point.x >= 0 && point.x < ctx.canvas.width && point.y >= 0 && point.y < ctx.canvas.height;

const getBoundingBoxIncludingBrush = (points: Point[], brushSize: number) => {
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

const getBoundingBox = (points: Point[]) => {
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

const drawEllipse = (points: Point[], brushSize: number, ctx: CanvasRenderingContext2D, fill: boolean) => {
  ellipse(points, brushSize, fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
};

const ellipse = (points: Point[], brushSize: number, fill: boolean, fillRect: (x: number, y: number, w: number, h: number) => void) => {
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

export const withSelectionClip = (ctx: CanvasRenderingContext2D, fn: () => void) => {
  const { selectedPoints } = useSelectionState.getState();

  if (selectedPoints.length === 0) {
    fn();
  }

  return withClip(ctx, selectedPoints, fn);
};
