import { useCheatSheetState } from "../components/CheatSheetButton";
import { useClipboardState } from "../model/Clipboard";
import { useWorkspaceState } from "../model/Workspace";
import { usePlacingState } from "../model/WorkspaceModes/PlacingMode";
import { KeyBindPreset } from "../types/keybinds";

export const generatePlacingKeybindings = (preset: KeyBindPreset) => {
  const commonBindings = [
    {
      commands: ["escape"],
      callback: (e: KeyboardEvent) => {
        endPlacing();
        e.preventDefault();
      },
      description: "Cancel placing",
    },
    {
      commands: ["enter"],
      callback: () => {
        commitPlacing();
        endPlacing();
      },
      description: "Commit placing",
    },
    {
      commands: ["ctrl+v", "command+v"],
      callback: () => {
        commitPlacing();
        const { canvas } = useWorkspaceState.getState();
        if (!canvas) {
          return;
        }

        const { placeFromClipboard } = usePlacingState.getState();
        placeFromClipboard();
      },
      description: "Paste",
    },
    {
      commands: ["?"],
      callback: () => useCheatSheetState.getState().toggle(),
      description: "Open cheat sheet",
    },
  ];

  return commonBindings;
};

// Helper functions (declared here to avoid circular imports)
let endPlacing: () => Promise<void>;
let commitPlacing: () => void;

// These will be set by PlacingMode when it initializes
export const setPlacingModeHelpers = (
  endPlacingFn: () => Promise<void>,
  commitPlacingFn: () => void
) => {
  endPlacing = endPlacingFn;
  commitPlacing = commitPlacingFn;
};