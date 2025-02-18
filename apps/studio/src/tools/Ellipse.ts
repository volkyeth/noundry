import { IoEllipseOutline } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { ellipse } from "./shapes";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

export const Ellipse = (): Tool => ({
  apply: (points, canvas) => {
    const { fgColor, bgColor, brushSize } = useBrush.getState();
    const ctx = canvas.getContext("2d")!;
    const fill = true;

    withSelectionClip(ctx, () => {
      ctx.fillStyle = bgColor;
      ellipse(points, brushSize, fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
      ctx.fillStyle = fgColor;
      ellipse(points, brushSize, !fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
    });
  },
  name: "Ellipse",
  icon: IoEllipseOutline,
}); 