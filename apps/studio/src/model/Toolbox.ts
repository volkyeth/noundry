import { create } from "zustand";
import { Brush, Tool } from "../tools/tools";

// Key for localStorage
const LEGACY_PALETTE_MODE_KEY = "noundry-legacy-palette-mode";

// Get initial legacy mode from localStorage or default to false
const getInitialLegacyPaletteMode = (): boolean => {
  try {
    const stored = localStorage.getItem(LEGACY_PALETTE_MODE_KEY);
    return stored ? JSON.parse(stored) : false;
  } catch (e) {
    return false;
  }
};

export type ToolboxState = {
  tool: Tool;
  previousTool: Tool;
  selectTool: (tool: Tool) => void;
  legacyPaletteMode: boolean;
  toggleLegacyPaletteMode: () => void;
  setLegacyPaletteMode: (enabled: boolean) => void;
};

export const useToolboxState = create<ToolboxState>()((set) => ({
  tool: Brush(),
  previousTool: Brush(),
  selectTool: (tool: Tool) => set(previous => tool.name === previous.tool.name ? previous : ({ tool, previousTool: previous.tool })),
  legacyPaletteMode: getInitialLegacyPaletteMode(),
  toggleLegacyPaletteMode: () =>
    set((state) => {
      const newValue = !state.legacyPaletteMode;
      localStorage.setItem(LEGACY_PALETTE_MODE_KEY, JSON.stringify(newValue));
      return { legacyPaletteMode: newValue };
    }),
  setLegacyPaletteMode: (enabled: boolean) => {
    localStorage.setItem(LEGACY_PALETTE_MODE_KEY, JSON.stringify(enabled));
    set({ legacyPaletteMode: enabled });
  },
}));