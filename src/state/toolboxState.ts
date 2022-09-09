import create from "zustand";
import { Color, Pen, Tool } from "../tools/tools";

export type ToolboxState = {
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  tool: Tool;
  selectTool: (tool: Tool) => void;
  color: Color;
  setColor: (color: Color) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  brushSize: 1,
  setBrushSize: (brushSize: number) => set({ brushSize }),
  tool: Pen(),
  selectTool: (tool: Tool) => set({ tool }),
  color: "#000000",
  setColor: (color: Color) => set({ color }),
}));
