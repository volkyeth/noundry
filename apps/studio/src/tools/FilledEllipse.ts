import { IoEllipse } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { ellipse } from "./shapes";
import { Tool } from "./types";
import { withSelectionClip } from "./utils";

export const FilledEllipse = (): Tool => ({
    apply: (points, canvas) => {
        const { color, brushSize } = useBrush.getState();
        const ctx = canvas.getContext("2d")!;
        const fill = true;

        withSelectionClip(ctx, () => {
            // Use color for both fill and outline
            ctx.fillStyle = color;
            ellipse(points, brushSize, fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
            ellipse(points, brushSize, !fill, (x, y, w, h) => ctx.fillRect(x, y, w, h));
        });
    },
    name: "Filled Ellipse",
    icon: IoEllipse,
}); 