import { IoEllipseOutline } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { ellipse } from "./shapes";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

export const Ellipse = (): Tool => ({
  apply: (points, canvas) => {
    const { strokeColor, fillColor, brushSize } = useBrush.getState();
    const ctx = canvas.getContext("2d")!;
    const fill = true;

    withSelectionClip(ctx, () => {
      ctx.fillStyle = fillColor;
      ellipse(points, brushSize, fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
      ctx.fillStyle = strokeColor;
      ellipse(points, brushSize, !fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
    });
  },
  name: "Ellipse",
  icon: IoEllipseOutline,
}); 