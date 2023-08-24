import { create } from "zustand";
import { Color, Pen, Tool } from "../tools/tools";

export type ToolboxState = {
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  tool: Tool;
  selectTool: (tool: Tool) => void;
  fgColor: Color;
  setFgColor: (color: Color) => void;
  bgColor: Color;
  setBgColor: (color: Color) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  brushSize: 1,
  setBrushSize: (brushSize: number) => set({ brushSize }),
  tool: Pen(),
  selectTool: (tool: Tool) => set({ tool }),
  fgColor: "#000000",
  setFgColor: (color: Color) => set({ fgColor: color }),
  bgColor: "#00000000",
  setBgColor: (color: Color) => set({ bgColor: color }),
}));
