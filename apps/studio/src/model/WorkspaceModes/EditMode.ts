import { MouseEvent as ReactMouseEvent } from "react";
import { useCheatSheetState } from "../../components/CheatSheetButton";
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
} from "../../tools/tools";
import { Point } from "../../types/geometry";
import { clearCanvas } from "../../utils/canvas/clearCanvas";
import { replaceCanvas } from "../../utils/canvas/replaceCanvas";
import { MouseButton, MouseEventType } from "../../utils/constants";
import { getCanvasPoint } from "../../utils/geometry/getCanvasPoint";
import { Brush, useBrush } from "../Brush";
import { useClipboardState } from "../Clipboard";
import { useCursor } from "../Cursor";
import { drawNounCanvas, useNounState } from "../Noun";
import { NounPartState } from "../NounPart";
import { useSelection } from "../Selection";
import { useToolboxState } from "../Toolbox";
import { WorkspaceMode, useWorkspaceState } from "../Workspace";
import { usePlacingState } from "./PlacingMode";

export const EditMode: WorkspaceMode = {
  name: "Edit",
  init: () => {
    const nounState = useNounState.getState();
    if (!nounState.activePart) {
      return;
    }
    const activeNounPart = nounState[nounState.activePart];
    const workspaceCanvas = useWorkspaceState.getState().canvas;
    if (!workspaceCanvas) {
      return;
    }

    replaceCanvas(activeNounPart.canvas, workspaceCanvas);
  },
  handleMouseEvent: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    const nounState = useNounState.getState();

    if (!nounState.activePart) {
      return;
    }

    const activeNounPart = nounState[nounState.activePart];

    const { clickingLeft } = useCursor.getState();

    const workspace = useWorkspaceState.getState();
    if (!workspace.canvas) return;

    const point = getCanvasPoint(e, workspace.canvas);
    switch (true) {
      case e.type === MouseEventType.Down && e.button === MouseButton.Left:
        handleLeftMouseDown(point, workspace.canvas, activeNounPart);
        return;
      case e.type === MouseEventType.Up && clickingLeft:
        handleMouseMove(point, workspace.canvas, activeNounPart);
        handleLeftMouseUp(point, workspace.canvas, activeNounPart);
        return;
      case e.type === MouseEventType.Move && clickingLeft:
        handleMouseMove(point, workspace.canvas, activeNounPart);
        handleLeftMouseMove(point, workspace.canvas, activeNounPart);
        return;
      case e.type === MouseEventType.Move:
        handleMouseMove(point, workspace.canvas, activeNounPart);
        return;
      default:
    }
  },
  keyBindings: [
    {
      commands: ["escape"],
      callback: (e) => {
        useSelection.getState().clearSelection();
        e.preventDefault();
      },
      description: "Clear selection",
    },
    {
      commands: ["ctrl+z", "command+z"],
      callback: (e) => {
        e.preventDefault();
        const activePart = useNounState.getState().getActivePartState();
        if (!activePart || !activePart.canUndo) return;
        activePart.undo();

      },
      description: "Undo",
    },
    {
      commands: ["ctrl+shift+z", "command+shift+z"],
      callback: (e) => {
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
    { commands: ["b"], callback: () => useToolboxState.getState().selectTool(BrushTool()), description: "Brush tool" },
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
    { commands: ["e"], callback: () => useToolboxState.getState().selectTool(Eraser()), description: "Eraser tool" },
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
    { commands: ["g"], callback: () => useToolboxState.getState().selectTool(Bucket()), description: "Bucket tool" },
    { commands: ["v"], callback: () => useToolboxState.getState().selectTool(Move()), description: "Move tool" },
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

    { commands: ["i"], callback: () => useToolboxState.getState().selectTool(Eyedropper()), description: "Eyedropper tool" },
    { commands: ["?"], callback: () => useCheatSheetState.getState().toggle(), description: "Open cheat sheet" },
  ],
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

const handleLeftMouseDown = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  applyTool([point], canvas, partState);
  Brush.drawHover(point, canvas!);
  drawNounCanvas(useNounState.getState());
  useCursor.setState({ pathPoints: [point], clickingLeft: true });
};

const handleLeftMouseMove = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  const { pathPoints } = useCursor.getState();
  applyTool([...pathPoints, point], canvas, partState);
  Brush.drawHover(point, canvas);
  drawNounCanvas(useNounState.getState());
  useCursor.setState({ pathPoints: [...pathPoints, point] });
};

const handleLeftMouseUp = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  const { pathPoints } = useCursor.getState();
  const points = [...pathPoints, point];
  applyTool(points, canvas, partState);
  replaceCanvas(canvas, partState.canvas);
  Brush.drawHover(point, canvas);
  drawNounCanvas(useNounState.getState());
  partState.commit();

  useCursor.setState({ pathPoints: [], clickingLeft: false });
};

const handleMouseMove = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  replaceCanvas(partState.canvas, canvas);
  Brush.drawHover(point, canvas);
  drawNounCanvas(useNounState.getState());
};

const applyTool = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  const tool = useToolboxState.getState().tool;
  replaceCanvas(partState.canvas, workingCanvas);
  tool.apply(points, workingCanvas, partState);
  drawNounCanvas(useNounState.getState());
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
