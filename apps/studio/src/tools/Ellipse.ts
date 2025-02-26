import { IoEllipseOutline } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { ellipse } from "./shapes";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

export const Ellipse = (): Tool => ({
  apply: (points, canvas) => {
    const { color, brushSize } = useBrush.getState();
    const ctx = canvas.getContext("2d")!;
    const fill = true;
    const transparentFill = "#00000000"; // Transparent fill

    withSelectionClip(ctx, () => {
      // Use transparent fill for the fill part
      ctx.fillStyle = transparentFill;
      ellipse(points, brushSize, fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
      // Use stroke color for the outline
      ctx.fillStyle = color;
      ellipse(points, brushSize, !fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
    });
  },
  name: "Ellipse",
  icon: IoEllipseOutline,
}); 