import { TbCircleDashed, TbMarquee } from "react-icons/tb";
import { useSelection } from "../model/Selection";
import { isInside } from "../utils/canvas/isInside";
import { ellipse } from "./shapes";
import { Tool } from "./types";

export const RectangularSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { setRectSelection } = useSelection.getState();

    const start = points[0];
    const end = points[points.length - 1];

    if (!isInside(canvas, start) && !isInside(canvas, end)) {
      return;
    }

    setRectSelection(start, end);
  },
  name: "Rectangular Selection",
  icon: TbMarquee,
  shortcut: "M",
});

export const EllipticalSelection = (): Tool => ({
  apply: (points, canvas) => {
    const { clearSelection, addRectSelection } = useSelection.getState();
    clearSelection();
    ellipse(points, 1, true, (x: number, y: number, w: number, h: number) => addRectSelection({ x, y }, { x: x + w, y: y + h }));
  },
  name: "Elliptical Selection",
  icon: TbCircleDashed,
  shortcut: "M",
}); 