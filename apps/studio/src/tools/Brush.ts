import { MdBrush } from "react-icons/md";
import { useBrush } from "../model/Brush";
import { drawLine } from "../utils/canvas";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

export const Brush = (): Tool => ({
    apply: (points, canvas) => {
        const { strokeColor, brushSize } = useBrush.getState();

        const ctx = canvas.getContext("2d")!;
        withSelectionClip(ctx, () => {
            for (let i = 0; i < points.length; i++) {
                drawLine(points[i === 0 ? 0 : i - 1], points[i], strokeColor, brushSize, ctx);
            }
        });
    },
    name: "Brush",
    icon: MdBrush,
    shortcut: "B",
}); 