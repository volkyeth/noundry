import Mousetrap, { ExtendedKeyboardEvent } from "mousetrap";
import { MouseEvent as ReactMouseEvent } from "react";
import { create } from "zustand";
import { replaceCanvas } from "../utils/canvas/replaceCanvas";
import { useNounState } from "./Noun";
import { EditMode } from "./WorkspaceModes/EditMode";
export interface WorkspaceMode {
  name: "Edit" | "Placing";
  init: () => void;
  handleMouseEvent: (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
  keyBindings: { commands: string[]; callback: (e: ExtendedKeyboardEvent) => void; action?: "keypress" | "keyup" | "keydown"; description: string }[];
}

export type WorkspaceState = {
  mode: WorkspaceMode;
  changeMode: (mode: WorkspaceMode) => void;
  rebindKeys: () => void;
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
  const bindKeysForMode = (mode: WorkspaceMode) => {
    Mousetrap.reset();
    mode.keyBindings.forEach((binding) => {
      Mousetrap.bind(binding.commands, binding.callback);
    });
  };

  // Defer EditMode initialization to avoid circular dependency issues
  setTimeout(() => {
    bindKeysForMode(EditMode);
    EditMode.init();
  }, 0);

  return {
    mode: EditMode,
    changeMode: (mode: WorkspaceMode) => {
      bindKeysForMode(mode);
      mode.init();
      set({ mode });
    },
    rebindKeys: () => {
      const { mode } = get();
      bindKeysForMode(mode);
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
