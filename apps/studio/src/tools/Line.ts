import { BsSlash } from "react-icons/bs";
import { useBrush } from "../model/Brush";
import { drawLine } from "../utils/canvas";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

export const Line = (): Tool => ({
  apply: (points, canvas) => {
    const { color, brushSize } = useBrush.getState();

    const ctx = canvas.getContext("2d")!;
    withSelectionClip(ctx, () => {
      drawLine(points[points.length > 1 ? 1 : 0], points[Math.max(0, points.length - 2)], color, brushSize, ctx);
    });
  },
  name: "Line",
  icon: BsSlash,
  shortcut: "U",
}); 