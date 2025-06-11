import { MouseEvent as ReactMouseEvent } from "react";
import { Point } from "../../types/geometry";
import { replaceCanvas } from "../../utils/canvas/replaceCanvas";
import { MouseButton, MouseEventType } from "../../utils/constants";
import { getCanvasPoint } from "../../utils/geometry/getCanvasPoint";
import { generateKeybindings } from "../../utils/keybinds";
import { Brush } from "../Brush";
import { useCursor } from "../Cursor";
import { useKeybindPresetState } from "../KeybindPresets";
import { drawNounCanvas, useNounState } from "../Noun";
import { NounPartState } from "../NounPart";
import { useToolboxState } from "../Toolbox";
import { WorkspaceMode, useWorkspaceState } from "../Workspace";

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
  get keyBindings() {
    const { activePreset } = useKeybindPresetState.getState();
    return generateKeybindings(activePreset);
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

