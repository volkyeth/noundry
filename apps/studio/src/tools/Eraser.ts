import { RiEraserFill } from "react-icons/ri";
import { useBrush } from "../model/Brush";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

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