import { createRef, MouseEvent as ReactMouseEvent, RefObject } from "react";
import create from "zustand";
import { canvasPoint, clearCanvas, Point, replaceCanvas, replaceCanvasWithBlob } from "../utils/canvas";
import { MouseButton as MouseButton, MouseEventType, NounPart } from "../utils/constants";
import { useNounState } from "./nounState";
import { useToolboxState } from "./toolboxState";

export type WorkspaceState = {
  workingCanvasRef: RefObject<HTMLCanvasElement>;
  tmpCanvasRef: RefObject<HTMLCanvasElement>;
  pathPoints: Point[];
  clickingLeft: boolean;
  handleMouseEvent: (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const useWorkspaceState = create<WorkspaceState>()((set) => ({
  workingCanvasRef: createRef<HTMLCanvasElement>(),
  tmpCanvasRef: createRef<HTMLCanvasElement>(),
  pathPoints: [],
  clickingLeft: false,
  handleMouseEvent: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    set((state) => {
      if (!state.tmpCanvasRef.current || !state.workingCanvasRef.current) return state;

      const point = canvasPoint(e, state.tmpCanvasRef.current);
      switch (true) {
        case e.type === MouseEventType.Down && e.button === MouseButton.Left:
          return handleLeftMouseDown(point, state);
        case e.type === MouseEventType.Up && state.clickingLeft:
          return handleLeftMouseUp(point, state);
        case e.type === MouseEventType.Move && state.clickingLeft:
          return handleLeftMouseMove(point, state);
        default:
          return state;
      }
    });
  },
}));

const handleLeftMouseDown = (point: Point, state: WorkspaceState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([point], state.tmpCanvasRef.current!, state.workingCanvasRef.current!);
  return { pathPoints: [point], clickingLeft: true };
};

const handleLeftMouseMove = (point: Point, state: WorkspaceState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([...state.pathPoints, point], state.tmpCanvasRef.current!, state.workingCanvasRef.current!);
  return { pathPoints: [...state.pathPoints, point] };
};

const handleLeftMouseUp = (point: Point, state: WorkspaceState): WorkspaceState | Partial<WorkspaceState> => {
  applyTool([...state.pathPoints, point], state.tmpCanvasRef.current!, state.workingCanvasRef.current!);
  commitTmpCanvas(state.tmpCanvasRef.current!, state.workingCanvasRef.current!);
  return { pathPoints: [], clickingLeft: false };
};

const applyTool = (points: Point[], tmpCanvas: HTMLCanvasElement, workingCanvas: HTMLCanvasElement) => {
  const tool = useToolboxState.getState().tool;
  replaceCanvas(workingCanvas, tmpCanvas);
  tool.use(points, tmpCanvas);
};
const commitTmpCanvas = (tmpCanvas: HTMLCanvasElement, workingCanvas: HTMLCanvasElement) => {
  const activePart = useNounState.getState().activePart;

  if (!activePart) {
    throw "there should be an active part";
  }

  const activePartState = useNounState.getState()[activePart];

  if (!activePartState.canvas) {
    throw "active part canvas should be ready";
  }
  replaceCanvas(tmpCanvas, workingCanvas);
  replaceCanvas(workingCanvas, activePartState.canvas);
  clearCanvas(tmpCanvas);
  activePartState.commit();
};
