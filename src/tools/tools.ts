import { IconType } from "react-icons";
import { RiEraserFill, RiPencilFill, RiSipFill } from "react-icons/ri";
import { useToolboxState } from "../state/toolboxState";
import { drawLine, drawPixel, Point } from "../utils/canvas";

export type MouseEvent = "left-click-start" | "right-click-start" | "left-click-end" | "right-click-end" | "move";
export type ToolAction = (points: Point[], canvas: HTMLCanvasElement) => void;

export type Tool = {
  use: ToolAction;
  name: string;
  icon: IconType;
};

export type Color = string;

export const Pen = (): Tool => ({
  use: (points: Point[], canvas: HTMLCanvasElement) => {
    const color = useToolboxState.getState().color;
    drawPixel(points[0], color, canvas);

    for (let i = 1; i < points.length; i++) {
      drawLine(points[i - 1], points[i], color, canvas);
    }
  },
  name: "Pen",
  icon: RiPencilFill,
});

export const Eraser = (): Tool => ({
  use: (points: Point[], canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(points[0].x, points[0].y, 1, 1);

    for (let i = 1; i < points.length; i++) {
      ctx.clearRect(points[i - 1].x, points[i - 1].y, 1, 1);
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
    console.log(color);
    setColor(`#${color}`);
  },
  name: "Eyedropper",
  icon: RiSipFill,
});
