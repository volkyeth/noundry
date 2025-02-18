import { RiDragMove2Line } from "react-icons/ri";
import { useSelection } from "../model/Selection";
import { usePlacingState } from "../model/WorkspaceModes/PlacingMode";
import { Tool } from "./types";
import { clearCanvas } from "../utils/canvas/clearCanvas";
import { drawCanvas } from "../utils/canvas/drawCanvas";

export const Move = (): Tool => ({
  apply: (points, workingCanvas, partState) => {
    const { hasSelection } = useSelection.getState();

    if (hasSelection()) {
      const { placeFromSelection } = usePlacingState.getState();
      placeFromSelection();
      return;
    }

    const startPoint = points[0];

    const xOffset = points[points.length - 1].x - startPoint.x;
    const yOffset = points[points.length - 1].y - startPoint.y;

    clearCanvas(workingCanvas);
    drawCanvas(partState.canvas, workingCanvas, xOffset, yOffset);
  },

  name: "Move",
  icon: RiDragMove2Line,
  shortcut: "V",
}); 