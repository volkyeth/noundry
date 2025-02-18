import { RiSipFill } from "react-icons/ri";
import { useBrush } from "../model/Brush";
import { Tool } from "./types";

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