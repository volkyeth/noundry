import { createRef, MouseEvent as ReactMouseEvent, RefObject } from "react";
import create from "zustand";
import { canvasPoint, clearCanvas, Point, replaceCanvas, replaceCanvasWithBlob } from "../utils/canvas";
import { MouseButton as MouseButton, MouseEventType, NounPart } from "../utils/constants";
import { NounPartState } from "./nounPartState";
import { useNounState } from "./nounState";
import { useToolboxState } from "./toolboxState";

export type WorkspaceState = {
  canvas: HTMLCanvasElement | null;
  canvasRef: (canvas: HTMLCanvasElement | null) => void;
  pathPoints: Point[];
  clickingLeft: boolean;
  handleMouseEvent: (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const useWorkspaceState = create<WorkspaceState>()((set) => ({
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
  pathPoints: [],
  clickingLeft: false,
  handleMouseEvent: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    const nounState = useNounState.getState();

    if (!nounState.activePart) {
      return;
    }

    const activePartstate = nounState[nounState.activePart];

    set((state) => {
      if (!state.canvas) return state;

      const point = canvasPoint(e, state.canvas);
      switch (true) {
        case e.type === MouseEventType.Down && e.button === MouseButton.Left:
          return handleLeftMouseDown(point, state, activePartstate);
        case e.type === MouseEventType.Up && state.clickingLeft:
          return handleLeftMouseUp(point, state, activePartstate);
        case e.type === MouseEventType.Move && state.clickingLeft:
          return handleLeftMouseMove(point, state, activePartstate);
        default:
          return state;
      }
    });
  },
}));

const handleLeftMouseDown = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([point], state.canvas!, partState);
  return { pathPoints: [point], clickingLeft: true };
};

const handleLeftMouseMove = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([...state.pathPoints, point], state.canvas!, partState);
  return { pathPoints: [...state.pathPoints, point] };
};

const handleLeftMouseUp = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([...state.pathPoints, point], state.canvas!, partState);
  replaceCanvas(state.canvas!, partState.canvas);
  partState.commit();
  return { pathPoints: [], clickingLeft: false };
};

const applyTool = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  const tool = useToolboxState.getState().tool;
  replaceCanvas(partState.canvas, workingCanvas);
  tool.use(points, workingCanvas);
};
