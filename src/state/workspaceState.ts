import { MouseEvent as ReactMouseEvent } from "react";
import { create } from "zustand";
import { defaultFinalize } from "../tools/tools";
import { canvasPoint, drawCanvas, Point, replaceCanvas } from "../utils/canvas";
import { MouseButton, MouseEventType } from "../utils/constants";
import { useClipboardState } from "./clipboardState";
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
  apply: (action: (ctx: CanvasRenderingContext2D) => void) => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
};

export const useWorkspaceState = create<WorkspaceState>()((set, get) => ({
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
  apply: (action) => {
    const nounState = useNounState.getState();
    const { canvas } = get();

    if (!canvas || !nounState.activePart) {
      return;
    }

    const activePartState = nounState[nounState.activePart];
    const ctx = canvas.getContext("2d")!;
    action(ctx);
    replaceCanvas(canvas, activePartState.canvas);
    activePartState.commit();
  },
  demoMode: false,
  toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),
}));

const handleLeftMouseDown = (point: Point, state: WorkspaceState, partState: NounPartState): WorkspaceState | Partial<WorkspaceState> => {
  const tool = useToolboxState.getState().tool;
  if (tool.begin) {
    tool.begin([point], state.canvas!, partState);
  }
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
  const tool = useToolboxState.getState().tool;
  const points = [...state.pathPoints, point];
  applyTool(points, state.canvas!, partState);
  replaceCanvas(state.canvas!, partState.canvas);
  drawBrushHover(point, state);
  const finalize = tool.finalize ?? defaultFinalize;
  finalize(points, state.canvas!, partState);

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
  const { placingCanvas, placing, placeOffset } = useClipboardState.getState();
  replaceCanvas(partState.canvas, workingCanvas);
  tool.apply(points, workingCanvas, partState);
  if (placing) {
    drawCanvas(placingCanvas, workingCanvas, placeOffset.x, placeOffset.y);
  }
};
