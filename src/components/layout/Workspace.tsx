import { Center, CenterProps, HStack, Text, Tooltip } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { MdOutlineGridOff, MdOutlineGridOn } from "react-icons/md";
import { useNounState } from "../../state/nounState";
import { useWorkspaceState } from "../../state/workspaceState";
import { replaceCanvas } from "../../utils/canvas";
import { CanvasGrid } from "../CanvasGrid";
import { CheckerboardBg } from "../CheckerboardBg";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { ReactIcon } from "../ReactIcon";

type Point = { x: number; y: number };

export type WorkspaceProps = {} & CenterProps;

export const Workspace: FC<WorkspaceProps> = ({ ...props }) => {
  const { activePart } = useNounState();
  const { canvasRef, handleMouseEvent, gridOn, toggleGrid } = useWorkspaceState();
  useLoadActivePartToWorkingCanvasWhenChanged();
  useUndoRedoKeyboardShortcut();

  const canvasSize = ["224px", "256px", "320px", "512px", "640px", "768px", "960px"];

  return (
    <Center {...props} onMouseDown={handleMouseEvent} onMouseUp={handleMouseEvent} onMouseMove={handleMouseEvent}>
      {activePart ? (
        <CheckerboardBg w={canvasSize} h={canvasSize} position="relative">
          <PixelArtCanvas style={{ width: "100%", height: "100%", position: "absolute" }} id="working-canvas" ref={canvasRef} />
          {gridOn && <CanvasGrid w={canvasSize} h={canvasSize} position="absolute" />}
          <HStack h={10} position="absolute" bottom={-10} right={0}>
            <Tooltip label={"Toggle grid"}>
              <ReactIcon
                icon={gridOn ? MdOutlineGridOn : MdOutlineGridOff}
                boxSize={8}
                onClick={toggleGrid}
                color={"gray.850"}
                _hover={{ color: "gray.600" }}
                cursor={"pointer"}
              />
            </Tooltip>
          </HStack>
        </CheckerboardBg>
      ) : (
        <Text>Select a part to edit</Text>
      )}
    </Center>
  );
};

const useUndoRedoKeyboardShortcut = () => {
  const { activePart } = useNounState();
  const { canvas } = useWorkspaceState();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePart) {
        return;
      }

      const activePartState = useNounState.getState()[activePart];
      if (!activePartState.canvas || !canvas || (!e.ctrlKey && !e.metaKey) || !["z", "Z"].includes(e.key)) {
        return;
      }

      if (e.shiftKey ? !activePartState.canRedo : !activePartState.canUndo) {
        return;
      }
      e.shiftKey ? activePartState.redo() : activePartState.undo();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePart, canvas]);
};

const useLoadActivePartToWorkingCanvasWhenChanged = () => {
  useEffect(() => {
    return useNounState.subscribe((state) => {
      const canvas = useWorkspaceState.getState().canvas;
      if (!canvas || state.activePart === null) {
        return;
      }

      replaceCanvas(state[state.activePart].canvas, canvas);
    });
  }, []);
};
