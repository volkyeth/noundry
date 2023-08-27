import { MouseEvent as ReactMouseEvent } from "react";
import { create } from "zustand";
import { withSelectionClip } from "../../tools/tools";
import { Point, canvasPoint, clearCanvas, drawCanvas, replaceCanvas } from "../../utils/canvas";
import { MouseButton, MouseEventType } from "../../utils/constants";
import { Brush } from "../Brush";
import { useClipboardState } from "../Clipboard";
import { useNounState } from "../Noun";
import { NounPartState } from "../NounPart";
import { useSelection } from "../Selection";
import { useToolboxState } from "../Toolbox";
import { WorkspaceMode, useWorkspaceState } from "../Workspace";

type EditModeState = {
  pathPoints: Point[];
  clickingLeft: boolean;
};

const useEditModeState = create<EditModeState>()(() => ({
  pathPoints: [],
  clickingLeft: false,
}));

export const EditMode: WorkspaceMode = {
  handleMouseEvent: (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    const nounState = useNounState.getState();

    if (!nounState.activePart) {
      return;
    }

    const activeNounPart = nounState[nounState.activePart];

    const { clickingLeft } = useEditModeState.getState();

    const workspace = useWorkspaceState.getState();
    if (!workspace.canvas) return;

    const point = canvasPoint(e, workspace.canvas);
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
    { commands: ["escape"], action: useSelection.getState().clearSelection },
    {
      commands: ["ctrl+c", "command+c"],
      action: () => {
        const { hasSelection } = useSelection.getState();
        if (!hasSelection()) return;

        const { canvas } = useWorkspaceState.getState();
        if (!canvas) return;

        const { saveSelectionToClipboard } = useClipboardState.getState();
        saveSelectionToClipboard(canvas);
      },
    },
    {
      commands: ["ctrl+x", "command+x"],
      action: () => {
        const { hasSelection } = useSelection.getState();
        if (!hasSelection()) return;

        const { canvas } = useWorkspaceState.getState();
        if (!canvas) return;

        const { saveSelectionToClipboard } = useClipboardState.getState();
        saveSelectionToClipboard(canvas);
        apply((ctx) => {
          withSelectionClip(ctx, () => {
            clearCanvas(canvas);
          });
        });
      },
    },

    {
      commands: ["del", "backspace"],
      action: () => {
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
    },
    {
      commands: ["ctrl+v", "command+v"],
      action: () => {
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
    },
  ],
  // Mousetrap.bind("escape", () => {
  //   if (!canvas) {
  //     return;
  //   }

  //   if (placing) {
  //     place(canvas);
  //     return;
  //   }
  //   clearSelection();
  // });

  // Mousetrap.bind("enter", () => {
  //   if (!canvas || !placing) {
  //     return;
  //   }

  //   place(canvas);
  // });

  // Mousetrap.bind(["ctrl+c", "command+c"], () => {
  //   if (!hasSelection() || !canvas) {
  //     return;
  //   }

  //   console.log("copied");

  //   saveSelectionToClipboard(canvas);
  // });

  // Mousetrap.bind(["ctrl+x", "command+x"], () => {
  //   if (!hasSelection() || !canvas) {
  //     return;
  //   }

  //   saveSelectionToClipboard(canvas);
  //   apply((ctx) => {
  //     withSelectionClip(ctx, () => {
  //       clearCanvas(canvas);
  //     });
  //   });
  // });

  // Mousetrap.bind(["del", "backspace"], () => {
  //   if (!hasSelection() || !canvas) {
  //     return;
  //   }

  //   apply((ctx) => {
  //     withSelectionClip(ctx, () => {
  //       clearCanvas(canvas);
  //     });
  //   });
  // });

  // Mousetrap.bind(["ctrl+v", "command+v"], () => {
  //   if (!canvas) {
  //     return;
  //   }

  //   if (placing) {
  //     place(canvas);
  //   }

  //   clearSelection();
  //   placeFromClipboard();
  // });

  // Mousetrap.bind(["ctrl+shift+v", "command+shift+v"], () => {
  //   if (!canvas) {
  //     return;
  //   }

  //   placeFromClipboard();
  // });
};

const handleLeftMouseDown = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  applyTool([point], canvas, partState);
  Brush.drawHover(point, canvas!);
  useEditModeState.setState({ pathPoints: [point], clickingLeft: true });
};

const handleLeftMouseMove = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  const { pathPoints } = useEditModeState.getState();
  applyTool([...pathPoints, point], canvas, partState);
  Brush.drawHover(point, canvas);
  useEditModeState.setState({ pathPoints: [...pathPoints, point] });
};

const handleLeftMouseUp = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  const { pathPoints } = useEditModeState.getState();
  const points = [...pathPoints, point];
  applyTool(points, canvas, partState);
  replaceCanvas(canvas, partState.canvas);
  Brush.drawHover(point, canvas);
  partState.commit();

  useEditModeState.setState({ pathPoints: [], clickingLeft: false });
};

const handleMouseMove = (point: Point, canvas: HTMLCanvasElement, partState: NounPartState) => {
  replaceCanvas(partState.canvas, canvas);
  Brush.drawHover(point, canvas);
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
