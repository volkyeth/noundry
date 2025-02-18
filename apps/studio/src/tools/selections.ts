import { TbCircleDashed, TbMarquee } from "react-icons/tb";
import { useSelection } from "../model/Selection";
import { isInside } from "../utils/canvas/isInside";
import { ellipse } from "./shapes";
import { Tool } from "./types";

const clampPoint = (point: { x: number; y: number }, width: number, height: number) => ({
  x: Math.max(0, Math.min(width - 1, point.x)),
  y: Math.max(0, Math.min(height - 1, point.y))
});

export const RectangularSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { setRectSelection } = useSelection.getState();

    const start = points[0];
    const end = points[points.length - 1];

    if (!start || !end) {
      return;
    }

    // Use unclamped points for calculating the selection area
    const left = Math.min(start.x, end.x);
    const right = Math.max(start.x, end.x);
    const top = Math.min(start.y, end.y);
    const bottom = Math.max(start.y, end.y);

    // But clamp the actual selection to canvas bounds
    const clampedStart = clampPoint({ x: left, y: top }, canvas.width, canvas.height);
    const clampedEnd = clampPoint({ x: right, y: bottom }, canvas.width, canvas.height);

    setRectSelection(clampedStart, clampedEnd);
  },
  name: "Rectangular Selection",
  icon: TbMarquee,
  shortcut: "M",
});

export const EllipticalSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { clearSelection, addRectSelection } = useSelection.getState();
    clearSelection();
    
    // Use unclamped points for shape calculation but clamp individual points when adding to selection
    ellipse(points, 1, true, (x: number, y: number, w: number, h: number) => {
      const start = clampPoint({ x, y }, canvas.width, canvas.height);
      const end = clampPoint({ x: x + w, y: y + h }, canvas.width, canvas.height);
      if (isInside(canvas, start) || isInside(canvas, end)) {
        addRectSelection(start, end);
      }
    });
  },
  name: "Elliptical Selection",
  icon: TbCircleDashed,
  shortcut: "M",
}); 