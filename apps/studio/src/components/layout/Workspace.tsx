import { Center, CenterProps, HStack, Text, Tooltip } from "@chakra-ui/react";
import { FC, useEffect } from "react";
import { MdOutlineGridOff, MdOutlineGridOn } from "react-icons/md";
import { useNounState } from "../../model/Noun";
import { useToolboxState } from "../../model/Toolbox";
import { useWorkspaceState } from "../../model/Workspace";
import { Move } from "../../tools/tools";
import { replaceCanvas } from "../../utils/canvas/replaceCanvas";
import { CanvasGrid } from "../CanvasGrid";
import { CheckerboardBg } from "../CheckerboardBg";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { PlacingOverlay } from "../PlacingOverlay";
import { ReactIcon } from "../ReactIcon";
import { SelectionOverlay } from "../SelectionOverlay";

type Point = { x: number; y: number };

export type WorkspaceProps = {} & CenterProps;

export const Workspace: FC<WorkspaceProps> = ({ ...props }) => {
  const { activePart } = useNounState();
  const { canvasRef, mode, gridOn, toggleGrid } = useWorkspaceState();
  useLoadActivePartToWorkingCanvasWhenChanged();

  const canvasSize = ["224px", "256px", "320px", "512px", "640px", "768px", "960px"];
  const isPlacing = mode.name === "Placing";
  const isMoveTool = useToolboxState((state) => state.tool.name === Move.name);

  return (
    <Center
      {...props}
      onMouseDown={mode.handleMouseEvent}
      onMouseUp={mode.handleMouseEvent}
      onMouseMove={mode.handleMouseEvent}
      border={isPlacing ? "10px cyan solid" : undefined}
      cursor={isPlacing || isMoveTool ? "move" : undefined}
    >
      {activePart ? (
        <CheckerboardBg w={canvasSize} h={canvasSize} position="relative">
          <PixelArtCanvas style={{ width: "100%", height: "100%", position: "absolute" }} id="working-canvas" ref={canvasRef} />
          {gridOn && <CanvasGrid w={canvasSize} h={canvasSize} position="absolute" left={0} top={0} />}
          <SelectionOverlay position="absolute" top="-1px" left="-1px"  />
          {isPlacing && <PlacingOverlay position={"absolute"} />}
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
