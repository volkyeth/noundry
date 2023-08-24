import { create } from "zustand";
import { Pen, Tool } from "../tools/tools";

export type ToolboxState = {
  tool: Tool;
  selectTool: (tool: Tool) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  tool: Pen(),
  selectTool: (tool: Tool) => set({ tool }),
}));
