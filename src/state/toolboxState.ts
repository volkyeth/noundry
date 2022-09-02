import create from "zustand";
import { Color, Pen, Tool } from "../tools/tools";

export type ToolboxState = {
  tool: Tool;
  selectTool: (tool: Tool) => void;
  color: Color;
  setColor: (color: Color) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  tool: Pen(),
  selectTool: (tool: Tool) => set({ tool }),
  color: "#000000",
  setColor: (color: Color) => set({ color }),
}));
