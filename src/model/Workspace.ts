import Mousetrap from "mousetrap";
import { MouseEvent as ReactMouseEvent } from "react";
import { create } from "zustand";
import { replaceCanvas } from "../utils/canvas";
import { useNounState } from "./Noun";
import { EditMode } from "./WorkspaceModes/EditMode";

export interface WorkspaceMode {
  handleMouseEvent: (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
  keyBindings: { commands: string[]; action: () => void }[];
}

export type WorkspaceState = {
  mode: WorkspaceMode;
  changeMode: (mode: WorkspaceMode) => void;
  gridOn: boolean;
  toggleGrid: () => void;
  randomizeAllHovered: boolean;
  setRandomizeAllHovered: (hovered: boolean) => void;
  canvas: HTMLCanvasElement | null;
  canvasRef: (canvas: HTMLCanvasElement | null) => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
};

export const useWorkspaceState = create<WorkspaceState>()((set, get) => {
  EditMode.keyBindings.forEach((binding) => {
    Mousetrap.bind(binding.commands, binding.action);
  });

  return {
    mode: EditMode,
    changeMode: (mode: WorkspaceMode) => {
      Mousetrap.reset();
      mode.keyBindings.forEach((binding) => {
        Mousetrap.bind(binding.commands, binding.action);
      });
      set({ mode });
    },
    gridOn: false,
    toggleGrid: () => set((state) => ({ gridOn: !state.gridOn })),
    randomizeAllHovered: false,
    setRandomizeAllHovered: (hovered: boolean) => set({ randomizeAllHovered: hovered }),
    canvas: null,
    canvasRef: (canvas: HTMLCanvasElement | null) => {
      set({ canvas });

      if (!canvas) {
        return;
      }

      const nounState = useNounState.getState();

      if (!nounState.activePart) {
        return;
      }

      const nounpart = nounState[nounState.activePart];

      replaceCanvas(nounpart.canvas, canvas);
    },
    demoMode: false,
    toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),
  };
});
