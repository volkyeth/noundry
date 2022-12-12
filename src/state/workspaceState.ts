import { MouseEvent as ReactMouseEvent } from "react";
import create from "zustand";
import { canvasPoint, Point, replaceCanvas } from "../utils/canvas";
import { MouseButton as MouseButton, MouseEventType } from "../utils/constants";
import { NounPartState } from "./nounPartState";
import { useNounState } from "./nounState";
import { useToolboxState } from "./toolboxState";

export type WorkspaceState = {
  gridOn: boolean;
  toggleGrid: () => void;
  randomizeAllHovered: boolean;
  setRandomizeAllHovered: (hovered: boolean) => void;
  canvas: HTMLCanvasElement | null;
  canvasRef: (canvas: HTMLCanvasElement | null) => void;
  pathPoints: Point[];
  clickingLeft: boolean;
  handleMouseEvent: (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const useWorkspaceState = create<WorkspaceState>()((set) => ({
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
          handleMouseMove(point, state, activePartstate);
          return handleLeftMouseUp(point, state, activePartstate);
        case e.type === MouseEventType.Move && state.clickingLeft:
          handleMouseMove(point, state, activePartstate);
          return handleLeftMouseMove(point, state, activePartstate);
        case e.type === MouseEventType.Move:
          return handleMouseMove(point, state, activePartstate);
        default:
          return state;
      }
    });
  },
}));

const handleLeftMouseDown = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([point], state.canvas!, partState);
  drawBrushHover(point, state);
  return { pathPoints: [point], clickingLeft: true };
};

const handleLeftMouseMove = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([...state.pathPoints, point], state.canvas!, partState);
  drawBrushHover(point, state);
  return { pathPoints: [...state.pathPoints, point] };
};

const handleLeftMouseUp = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([...state.pathPoints, point], state.canvas!, partState);
  replaceCanvas(state.canvas!, partState.canvas);
  drawBrushHover(point, state);
  partState.commit();
  return { pathPoints: [], clickingLeft: false };
};

const handleMouseMove = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  replaceCanvas(partState.canvas, state.canvas!);
  drawBrushHover(point, state);

  return state;
};

const drawBrushHover = (point: Point, state: WorkspaceState) => {
  const { brushSize } = useToolboxState.getState();
  const ctx = state.canvas?.getContext("2d")!;
  ctx.fillStyle = "#ffffff70";
  ctx.globalCompositeOperation = "difference";
  ctx.fillRect(point.x - brushSize + 1, point.y - brushSize + 1, brushSize, brushSize);
  ctx.globalCompositeOperation = "source-over";
};

const applyTool = (points: Point[], workingCanvas: HTMLCanvasElement, partState: NounPartState) => {
  const tool = useToolboxState.getState().tool;
  replaceCanvas(partState.canvas, workingCanvas);
  tool.use(points, workingCanvas, partState.canvas);
};
