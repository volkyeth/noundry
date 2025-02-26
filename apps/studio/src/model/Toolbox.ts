import { create } from "zustand";
import { Brush, Tool } from "../tools/tools";

export type ToolboxState = {
  tool: Tool;
  previousTool: Tool;
  selectTool: (tool: Tool) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  tool: Brush(),
  previousTool: Brush(),
  selectTool: (tool: Tool) => set(previous => tool.name === previous.tool.name ? previous : ({ tool, previousTool: previous.tool })),
}));