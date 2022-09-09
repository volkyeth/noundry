import React, { FC, RefObject, useEffect, useRef, useState } from "react";
import { Box, Center, CenterProps, Text, useBoolean } from "@chakra-ui/react";
import { PixelArtCanvas } from "../PixelArtCanvas";
import { clearCanvas, drawCanvas, replaceCanvas, replaceCanvasWithBlob } from "../../utils/canvas";
import { checkerboardBg, NounPart } from "../../utils/constants";
import { useToolboxState } from "../../state/toolboxState";
import { useWorkspaceState } from "../../state/workspaceState";
import { useNounState } from "../../state/nounState";

type Point = { x: number; y: number };

export type WorkspaceProps = {} & CenterProps;

export const Workspace: FC<WorkspaceProps> = ({ ...props }) => {
  const { activePart } = useNounState();
  const { canvasRef, handleMouseEvent } = useWorkspaceState();
  useLoadActivePartToWorkingCanvasWhenChanged();
  useUndoRedoKeyboardShortcut();

  const canvasSize = ["224px", "256px", "320px", "512px", "640px", "768px", "960px"];

  return (
    <Center {...props} onMouseDown={handleMouseEvent} onMouseUp={handleMouseEvent} onMouseMove={handleMouseEvent}>
      {activePart ? (
        <Box position="relative" w={canvasSize} h={canvasSize} {...checkerboardBg}>
          <PixelArtCanvas style={{ width: "100%", height: "100%", position: "absolute" }} id="working-canvas" ref={canvasRef} />
        </Box>
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
