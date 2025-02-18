import { IoSquareOutline } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { Tool } from "./types";
import { getBoundingBoxIncludingBrush, withSelectionClip } from "./utils";

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