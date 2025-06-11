import { MouseEvent as ReactMouseEvent } from "react";
import { create } from "zustand";
import { Point } from "../../types/geometry";
import { withClip } from "../../utils/canvas";
import { clearCanvas } from "../../utils/canvas/clearCanvas";
import { drawCanvas } from "../../utils/canvas/drawCanvas";
import { replaceCanvas } from "../../utils/canvas/replaceCanvas";
import { MouseButton, MouseEventType } from "../../utils/constants";
import { getCanvasPoint } from "../../utils/geometry/getCanvasPoint";
import { generatePlacingKeybindings, setPlacingModeHelpers } from "../../utils/placingKeybinds";
import { useClipboardState } from "../Clipboard";
import { useCursor } from "../Cursor";
import { useKeybindPresetState } from "../KeybindPresets";
import { drawNounCanvas, useNounState } from "../Noun";
import { NounPartState } from "../NounPart";
import { useSelection } from "../Selection";
import { WorkspaceMode, useWorkspaceState } from "../Workspace";

type PlacingState = {
  placingCanvas: HTMLCanvasElement;
  resetPlacing: () => void;
  place: (destinationCanvas: HTMLCanvasElement) => void;
  originalSelection: Point[];
  placeOffset: { x: number; y: number };
  offsetPlacing: (xOffset: number, yOffset: number) => void;
  placeFromClipboard: () => void;
  placeFromSelection: () => void;
};

export const usePlacingState = create<PlacingState>((set, get) => {
  const placingCanvas = document.createElement("canvas");
  placingCanvas.width = 32;
  placingCanvas.height = 32;
  placingCanvas.getContext("2d", { willReadFrequently: true });

  return {
    placingCanvas,
    placeOffset: { x: 0, y: 0 },
    originalSelection: [],
    offsetPlacing: (xOffset: number, yOffset: number) => {
      set((state) => {
        const { placeOffset } = state;
        return { placeOffset: { x: placeOffset.x + xOffset, y: placeOffset.y + yOffset } };
      });
    },
    resetPlacing: () => {
      set((state) => {
        if (state.placingCanvas) {
          clearCanvas(state.placingCanvas);
        }

        return { placeOffset: { x: 0, y: 0, originalSelection: [] } };
      });
    },
    placeFromClipboard: () => {
      const { clipboardCanvas, hasClipboard } = useClipboardState.getState();
      if (!hasClipboard() || !clipboardCanvas) return;

      const { placingCanvas, resetPlacing } = get();
      if (!placingCanvas) {
        return;
      }
      resetPlacing();
      drawCanvas(clipboardCanvas, placingCanvas);
      useWorkspaceState.getState().changeMode(PlacingMode);
    },
    placeFromSelection: () => {
      const { saveSelectionTo, clearSelection, selectedPoints } = useSelection.getState();
      const { placingCanvas, resetPlacing } = get();
      const workingCanvas = useWorkspaceState.getState().canvas;
      if (!placingCanvas || !workingCanvas) {
        return;
      }

      const ctx = workingCanvas.getContext("2d")!;
      resetPlacing();
      saveSelectionTo(placingCanvas);
      set({ originalSelection: selectedPoints });
      clearSelection();
      useWorkspaceState.getState().changeMode(PlacingMode);
    },
    place: (destinationCanvas) => {
      const { placingCanvas, resetPlacing, placeOffset } = get();
      if (!placingCanvas) {
        return;
      }
      const { x, y } = placeOffset;
      drawCanvas(placingCanvas, destinationCanvas, x, y);
      resetPlacing();
    },
  };
});

export const PlacingMode: WorkspaceMode = {
  name: "Placing",
  init: () => {
    // Set helper functions for the keybind utility
    setPlacingModeHelpers(endPlacing, commitPlacing);
    renderWorkspaceCanvas();
  },
  get keyBindings() {
    const { activePreset } = useKeybindPresetState.getState();
    return generatePlacingKeybindings(activePreset);
  },
  handleMouseEvent: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    const nounState = useNounState.getState();

    if (!nounState.activePart) {
      return;
    }

    const activeNounPart = nounState[nounState.activePart];

    const workspace = useWorkspaceState.getState();
    if (!workspace.canvas) return;

    const { clickingLeft } = useCursor.getState();

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
};

const renderWorkspaceCanvas = () => {
  const { getActivePartState } = useNounState.getState();
  const activePartCanvas = getActivePartState()?.canvas;
  if (!activePartCanvas) {
    return;
  }

  const workspaceCanvas = useWorkspaceState.getState().canvas;
  if (!workspaceCanvas) {
    return;
  }

  const { placingCanvas, placeOffset, originalSelection } = usePlacingState.getState();
  if (!placingCanvas) return;

  replaceCanvas(activePartCanvas, workspaceCanvas);
  const ctx = workspaceCanvas.getContext("2d")!;

  if (originalSelection.length > 0) {
    originalSelection.forEach(point => {
      ctx.clearRect(point.x, point.y, 1, 1);
    });
  }

  drawCanvas(placingCanvas, workspaceCanvas, placeOffset.x, placeOffset.y);
  drawNounCanvas(useNounState.getState());
};

const commitPlacing = () => {
  const nounState = useNounState.getState();
  if (!nounState.activePart) {
    return;
  }
  const activeNounPart = nounState[nounState.activePart];
  const workspaceCanvas = useWorkspaceState.getState().canvas;
  if (!workspaceCanvas) {
    return;
  }

  replaceCanvas(workspaceCanvas, activeNounPart.canvas);

  activeNounPart.commit();
};

const endPlacing = async () => {
  const { resetPlacing } = usePlacingState.getState();
  const { EditMode } = await import("./EditMode");
  useWorkspaceState.getState().changeMode(EditMode);
  resetPlacing();
  drawNounCanvas(useNounState.getState());
};

const handleLeftMouseDown = (point: Point, workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  useCursor.setState({ pathPoints: [point], clickingLeft: true });
};

const handleLeftMouseMove = (point: Point, workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  const { pathPoints } = useCursor.getState();
  const { offsetPlacing } = usePlacingState.getState();
  const xOffset = pathPoints[pathPoints.length - 1].x - (pathPoints[pathPoints.length - 2]?.x ?? pathPoints[pathPoints.length - 1].x);
  const yOffset = pathPoints[pathPoints.length - 1].y - (pathPoints[pathPoints.length - 2]?.y ?? pathPoints[pathPoints.length - 1].y);
  offsetPlacing(xOffset, yOffset);
  useCursor.setState({ pathPoints: [...pathPoints, point] });
};

const handleLeftMouseUp = (point: Point, workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  useCursor.setState({ pathPoints: [], clickingLeft: false });
};

const handleMouseMove = (point: Point, workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  renderWorkspaceCanvas();
};
