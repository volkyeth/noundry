import { IconType } from "react-icons";
import { NounPartState } from "../model/NounPart";
import { useSelection } from "../model/Selection";
import { Point } from "../types/geometry";
import { withClip } from "../utils/canvas";

export type ToolAction = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => void;

export type Tool = {
  apply: ToolAction;
  name: string;
  icon: IconType;
  shortcut?: string;
};

export type Color = string;

export { Brush } from "./Brush";
export { Bucket } from "./Bucket";
export { Ellipse } from "./Ellipse";
export { Eraser } from "./Eraser";
export { Eyedropper } from "./Eyedropper";
export { FilledEllipse } from "./FilledEllipse";
export { FilledRectangle } from "./FilledRectangle";
export { Line } from "./Line";
export { Move } from "./Move";
export { Rectangle } from "./Rectangle";
export { EllipticalSelection, RectangularSelection } from "./selections";

export const withSelectionClip = (ctx: CanvasRenderingContext2D, fn: () => void) => {
  const { selectedPoints } = useSelection.getState();

  if (selectedPoints.length === 0) {
    fn();
  }

  return withClip(ctx, selectedPoints, fn);
};
