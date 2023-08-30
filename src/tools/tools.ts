import { Colord, colord } from "colord";
import { IconType } from "react-icons";
import { BsSlash } from "react-icons/bs";
import { IoColorFill, IoEllipseOutline, IoSquareOutline } from "react-icons/io5";
import { MdBrush } from "react-icons/md";
import { RiDragMove2Line, RiEraserFill, RiSipFill } from "react-icons/ri";
import { TbCircleDashed, TbMarquee } from "react-icons/tb";
import { useBrush } from "../model/Brush";
import { NounPartState } from "../model/NounPart";
import { useSelection } from "../model/Selection";
import { usePlacingState } from "../model/WorkspaceModes/PlacingMode";
import { Point, clearCanvas, drawCanvas, drawLine, erasePixel, insideCanvas, paintPixel, withClip } from "../utils/canvas";
import { getPixelColor } from "../utils/colors";

export type ToolAction = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => void;

export type Tool = {
  apply: ToolAction;
  name: string;
  icon: IconType;
  shortcut?: string;
};

export type Color = string;

export const Brush = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, brushSize } = useBrush.getState();

    const ctx = canvas.getContext("2d")!;
    withSelectionClip(ctx, () => {
      for (let i = 0; i < points.length; i++) {
        drawLine(points[i === 0 ? 0 : i - 1], points[i], fgColor, brushSize, ctx);
      }
    });
  },
  name: "Brush",
  icon: MdBrush,
  shortcut: "B",
});

export const Move = (): Tool => ({
  apply: (points, workingCanvas, partState) => {
    const { hasSelection } = useSelection.getState();

    if (hasSelection()) {
      const { placeFromSelection } = usePlacingState.getState();
      placeFromSelection();
      return;
    }

    const startPoint = points[0];

    const xOffset = points[points.length - 1].x - startPoint.x;
    const yOffset = points[points.length - 1].y - startPoint.y;

    clearCanvas(workingCanvas);
    drawCanvas(partState.canvas, workingCanvas, xOffset, yOffset);
  },

  name: "Move",
  icon: RiDragMove2Line,
  shortcut: "V",
});

export const Line = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, brushSize } = useBrush.getState();

    const ctx = canvas.getContext("2d")!;
    withSelectionClip(ctx, () => {
      drawLine(points[points.length > 1 ? 1 : 0], points[Math.max(0, points.length - 2)], fgColor, brushSize, ctx);
    });
  },
  name: "Line",
  icon: BsSlash,
  shortcut: "U",
});

export const Rectangle = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, bgColor, brushSize } = useBrush.getState();

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
  shortcut: "R",
});

export const RectangularSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { setRectSelection } = useSelection.getState();

    const start = points[0];
    const end = points[points.length - 1];

    if (!insideCanvas(canvas, start) && !insideCanvas(canvas, end)) {
      return;
    }

    setRectSelection(start, end);
  },
  name: "Rectangular Selection",
  icon: TbMarquee,
  shortcut: "M",
});

export const EllipticalSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { clearSelection, addRectSelection } = useSelection.getState();
    clearSelection();
    ellipse(points, 1, true, (x, y, w, h) => addRectSelection({ x, y }, { x: x + w, y: y + h }));
  },
  name: "Elliptical Selection",
  icon: TbCircleDashed,
  shortcut: "M",
});

export const Ellipse = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, bgColor, brushSize } = useBrush.getState();
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
    const { brushSize } = useBrush.getState();
    const ctx = canvas.getContext("2d")!;
    withSelectionClip(ctx, () => {
      for (let i = 0; i < points.length; i++) {
        ctx.clearRect(points[i].x - brushSize + 1, points[i].y - brushSize + 1, brushSize, brushSize);
      }
    });
  },
  name: "Eraser",
  icon: RiEraserFill,
  shortcut: "E",
});

export const Eyedropper = (): Tool => ({
  apply: (points, canvas) => {
    const ctx = canvas.getContext("2d")!;
    const lastPoint = points[points.length - 1];
    const [r, g, b, a] = ctx.getImageData(lastPoint.x, lastPoint.y, 1, 1).data;

    const color = [r, g, b, a].map((i) => i.toString(16).padStart(2, "0")).join("");

    const { setFgColor } = useBrush.getState();
    if (color === "00000000") {
      return;
    }
    setFgColor(`#${color}`);
  },
  name: "Eyedropper",
  icon: RiSipFill,
  shortcut: "I",
});

export const Bucket = (): Tool => ({
  apply: (points, canvas) => {
    const ctx = canvas.getContext("2d")!;
    const { fgColor } = useBrush.getState();

    const lastPoint = points[points.length - 1];
    const fillColor = colord(fgColor);

    ctx.fillStyle = fgColor;

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
  const { selectedPoints } = useSelection.getState();

  if (selectedPoints.length === 0) {
    fn();
  }

  return withClip(ctx, selectedPoints, fn);
};
