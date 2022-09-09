import { IconType } from "react-icons";
import { RiEraserFill, RiPencilFill, RiSipFill } from "react-icons/ri";
import { TbLine } from "react-icons/tb";
import { useToolboxState } from "../state/toolboxState";
import { drawLine, drawPixel, Point } from "../utils/canvas";

export type ToolAction = (points: Point[], canvas: HTMLCanvasElement) => void;

export type Tool = {
  use: ToolAction;
  name: string;
  icon: IconType;
};

export type Color = string;

export const Pen = (): Tool => ({
  use: (points: Point[], canvas: HTMLCanvasElement) => {
    const { color, brushSize } = useToolboxState.getState();

    for (let i = 0; i < points.length; i++) {
      drawLine(points[i === 0 ? 0 : i - 1], points[i], color, brushSize, canvas);
    }
  },
  name: "Pen",
  icon: RiPencilFill,
});

export const Line = (): Tool => ({
  use: (points: Point[], canvas: HTMLCanvasElement) => {
    const { color, brushSize } = useToolboxState.getState();

    drawLine(points[points.length > 1 ? 1 : 0], points[Math.max(0, points.length - 2)], color, brushSize, canvas);
  },
  name: "Line",
  icon: TbLine,
});

export const Eraser = (): Tool => ({
  use: (points: Point[], canvas: HTMLCanvasElement) => {
    const { brushSize } = useToolboxState.getState();
    const ctx = canvas.getContext("2d")!;

    for (let i = 0; i < points.length; i++) {
      ctx.clearRect(points[i].x - brushSize + 1, points[i].y - brushSize + 1, brushSize, brushSize);
    }
  },
  name: "Eraser",
  icon: RiEraserFill,
});

export const Eyedropper = (): Tool => ({
  use: (points: Point[], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    const lastPoint = points[points.length - 1];
    const [r, g, b, a] = ctx.getImageData(lastPoint.x, lastPoint.y, 1, 1).data;

    const color = [r, g, b, a].map((i) => i.toString(16).padStart(2, "0")).join("");

    const { setColor } = useToolboxState.getState();
    if (color === "00000000") {
      return;
    }
    setColor(`#${color}`);
  },
  name: "Eyedropper",
  icon: RiSipFill,
});
