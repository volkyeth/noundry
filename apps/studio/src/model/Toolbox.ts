import { create } from "zustand";
import { Brush, Bucket, Ellipse, EllipticalSelection, Eraser, Eyedropper, FilledEllipse, FilledRectangle, Line, Move, Rectangle, RectangularSelection, Tool } from "../tools/tools";

export type ToolboxState = {
  tool: Tool;
  selectTool: (tool: Tool) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  tool: Brush(),
  selectTool: (tool: Tool) => set({ tool }),
}));


export const tools = [
  Brush(),
  Eraser(),
  Rectangle(),
  FilledRectangle(),
  Ellipse(),
  FilledEllipse(),
  Line(),
  Bucket(),
  RectangularSelection(),
  Move(),
  EllipticalSelection(),
  Eyedropper(),
]