import { useCheatSheetState } from "../components/CheatSheetButton";
import { useBrush } from "../model/Brush";
import { useClipboardState } from "../model/Clipboard";
import { useNounState } from "../model/Noun";
import { useSelection } from "../model/Selection";
import { useToolboxState } from "../model/Toolbox";
import { useWorkspaceState } from "../model/Workspace";
import { usePlacingState } from "../model/WorkspaceModes/PlacingMode";
import {
  Brush as BrushTool,
  Bucket,
  Ellipse,
  EllipticalSelection,
  Eraser,
  Eyedropper,
  FilledEllipse,
  FilledRectangle,
  Line,
  Move,
  Rectangle,
  RectangularSelection,
  withSelectionClip,
} from "../tools/tools";
import { KeyBindPreset } from "../types/keybinds";
import { clearCanvas } from "./canvas/clearCanvas";
import { replaceCanvas } from "./canvas/replaceCanvas";

export const generateKeybindings = (preset: KeyBindPreset) => {
  // For Aseprite, combine escape and ctrl+d into one keybinding entry
  const clearSelectionCommands = preset === "aseprite" 
    ? ["escape", "ctrl+d", "command+d"]
    : ["escape"];

  const commonBindings = [
    {
      commands: clearSelectionCommands,
      callback: (e: KeyboardEvent) => {
        useSelection.getState().clearSelection();
        e.preventDefault();
      },
      description: "Clear selection",
    },
    {
      commands: ["ctrl+z", "command+z"],
      callback: (e: KeyboardEvent) => {
        e.preventDefault();
        const activePart = useNounState.getState().getActivePartState();
        if (!activePart || !activePart.canUndo) return;
        activePart.undo();
      },
      description: "Undo",
    },
    {
      commands: ["ctrl+shift+z", "command+shift+z"],
      callback: (e: KeyboardEvent) => {
        e.preventDefault();
        const activePart = useNounState.getState().getActivePartState();
        if (!activePart || !activePart.canRedo) return;
        activePart.redo();
      },
      description: "Redo",
    },
    {
      commands: ["ctrl+c", "command+c"],
      callback: () => copySelectionToClipboard(),
      description: "Copy selection",
    },
    {
      commands: ["ctrl+x", "command+x"],
      callback: () => {
        const { clearSelection } = useSelection.getState();
        const { canvas } = useWorkspaceState.getState();
        if (!canvas) return;

        copySelectionToClipboard();
        apply((ctx) => {
          withSelectionClip(ctx, () => {
            clearCanvas(canvas);
          });
        });
        clearSelection();
      },
      description: "Cut selection",
    },
    {
      commands: ["del", "backspace"],
      callback: () => {
        const { hasSelection } = useSelection.getState();
        if (!hasSelection()) return;

        const { canvas } = useWorkspaceState.getState();
        if (!canvas) return;

        apply((ctx) => {
          withSelectionClip(ctx, () => {
            clearCanvas(canvas);
          });
        });
      },
      description: "Delete selection",
    },
    {
      commands: ["ctrl+v", "command+v"],
      callback: () => {
        const { hasClipboard } = useClipboardState.getState();
        const { clearSelection } = useSelection.getState();
        if (!hasClipboard()) {
          return;
        }

        const { canvas } = useWorkspaceState.getState();
        if (!canvas) {
          return;
        }

        clearSelection();
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

  const presetSpecificBindings = preset === "photoshop" ? [
    {
      commands: ["b"],
      callback: () => useToolboxState.getState().selectTool(BrushTool()),
      description: "Brush tool",
    },
    {
      commands: ["["],
      callback: () => useBrush.setState(({ brushSize }) => ({ brushSize: Math.max(brushSize - 1, 1) })),
      description: "Decrease brush size",
    },
    {
      commands: ["]"],
      callback: () => useBrush.setState(({ brushSize }) => ({ brushSize: Math.min(brushSize + 1, 6) })),
      description: "Increase brush size",
    },
    {
      commands: ["e"],
      callback: () => useToolboxState.getState().selectTool(Eraser()),
      description: "Eraser tool",
    },
    {
      commands: ["u"],
      callback: () => {
        const { tool, selectTool } = useToolboxState.getState();
        if (tool.name === "Line") {
          selectTool(Rectangle());
        } else if (tool.name === "Rectangle") {
          selectTool(FilledRectangle());
        } else if (tool.name === "Filled Rectangle") {
          selectTool(Ellipse());
        } else if (tool.name === "Ellipse") {
          selectTool(FilledEllipse());
        } else if (tool.name === "Filled Ellipse") {
          selectTool(Line());
        } else {
          selectTool(Line());
        }
      },
      description: "Cycle between Line, Rectangle and Ellipse tool",
    },
    {
      commands: ["g"],
      callback: () => useToolboxState.getState().selectTool(Bucket()),
      description: "Bucket tool",
    },
    {
      commands: ["v"],
      callback: () => useToolboxState.getState().selectTool(Move()),
      description: "Move tool",
    },
    {
      commands: ["m"],
      callback: () => {
        const { tool, selectTool } = useToolboxState.getState();
        if (tool.name === "Rectangular Selection") selectTool(EllipticalSelection());
        else if (tool.name === "Elliptical Selection") selectTool(RectangularSelection());
        else selectTool(RectangularSelection());
      },
      description: "Cycle between Rectangular and Elliptical Marquee tool",
    },
    {
      commands: ["i"],
      callback: () => useToolboxState.getState().selectTool(Eyedropper()),
      description: "Eyedropper tool",
    },
  ] : [
    // Aseprite keybindings
    {
      commands: ["b"],
      callback: () => useToolboxState.getState().selectTool(BrushTool()),
      description: "Brush tool",
    },
    {
      commands: ["-"],
      callback: () => useBrush.setState(({ brushSize }) => ({ brushSize: Math.max(brushSize - 1, 1) })),
      description: "Decrease brush size",
    },
    {
      commands: ["+"],
      callback: () => useBrush.setState(({ brushSize }) => ({ brushSize: Math.min(brushSize + 1, 6) })),
      description: "Increase brush size",
    },
    {
      commands: ["e"],
      callback: () => useToolboxState.getState().selectTool(Eraser()),
      description: "Eraser tool",
    },
    {
      commands: ["l"],
      callback: () => useToolboxState.getState().selectTool(Line()),
      description: "Line tool",
    },
    {
      commands: ["u"],
      callback: () => {
        const { tool, selectTool } = useToolboxState.getState();
        if (tool.name === "Rectangle") {
          selectTool(FilledRectangle());
        } else if (tool.name === "Filled Rectangle") {
          selectTool(Rectangle());
        } else {
          selectTool(Rectangle());
        }
      },
      description: "Cycle between Rectangle and Filled Rectangle tool",
    },
    {
      commands: ["shift+u"],
      callback: () => {
        const { tool, selectTool } = useToolboxState.getState();
        if (tool.name === "Ellipse") {
          selectTool(FilledEllipse());
        } else if (tool.name === "Filled Ellipse") {
          selectTool(Ellipse());
        } else {
          selectTool(Ellipse());
        }
      },
      description: "Cycle between Ellipse and Filled Ellipse tool",
    },
    {
      commands: ["g"],
      callback: () => useToolboxState.getState().selectTool(Bucket()),
      description: "Bucket tool",
    },
    {
      commands: ["v"],
      callback: () => useToolboxState.getState().selectTool(Move()),
      description: "Move tool",
    },
    {
      commands: ["m"],
      callback: () => useToolboxState.getState().selectTool(RectangularSelection()),
      description: "Rectangular Marquee tool",
    },
    {
      commands: ["shift+m"],
      callback: () => useToolboxState.getState().selectTool(EllipticalSelection()),
      description: "Elliptical Marquee tool",
    },
    {
      commands: ["i"],
      callback: () => useToolboxState.getState().selectTool(Eyedropper()),
      description: "Eyedropper tool",
    },
  ];

  return [...commonBindings, ...presetSpecificBindings];
};

const copySelectionToClipboard = () => {
  const { hasSelection } = useSelection.getState();
  if (!hasSelection()) return;

  const { canvas } = useWorkspaceState.getState();
  if (!canvas) return;

  const { getActivePartState } = useNounState.getState();
  const activePartCanvas = getActivePartState()?.canvas;
  if (!activePartCanvas) {
    return;
  }

  const { saveSelectionToClipboard } = useClipboardState.getState();
  saveSelectionToClipboard();
};

const apply = (action: (ctx: CanvasRenderingContext2D) => void) => {
  const nounState = useNounState.getState();
  if (!nounState.activePart) return;

  const { canvas } = useWorkspaceState.getState();
  if (!canvas) return;

  const activePartState = nounState[nounState.activePart];
  const ctx = canvas.getContext("2d")!;
  action(ctx);
  replaceCanvas(canvas, activePartState.canvas);
  activePartState.commit();
};