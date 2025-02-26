import { IoSquare } from "react-icons/io5";
import { useBrush } from "../model/Brush";
import { Tool } from "./types";
import { getBoundingBoxIncludingBrush, withSelectionClip } from "./utils";

export const FilledRectangle = (): Tool => ({
    apply: (points, canvas) => {
        const { strokeColor, brushSize } = useBrush.getState();

        const { start, end } = getBoundingBoxIncludingBrush(points, brushSize);

        const width = end.x - start.x + 1;
        const height = end.y - start.y + 1;

        const ctx = canvas.getContext("2d")!;

        withSelectionClip(ctx, () => {
            // Use stroke color for both fill and outline
            ctx.fillStyle = strokeColor;

            // Fill the rectangle
            ctx.fillRect(start.x, start.y, width, height);

            // Draw the outline (not necessary but ensures consistent thickness with the non-filled version)
            ctx.fillRect(start.x, start.y, width, brushSize);
            ctx.fillRect(end.x + 1, end.y + 1, -width, -brushSize);
            ctx.fillRect(start.x, start.y, brushSize, height);
            ctx.fillRect(end.x + 1, end.y + 1, -brushSize, -height);
        });
    },
    name: "Filled Rectangle",
    icon: IoSquare,
}); 