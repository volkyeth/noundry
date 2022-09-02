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
  const { workingCanvasRef, tmpCanvasRef, handleMouseEvent } = useWorkspaceState();
  useCopyActivePartToWorkingCanvas();
  useUndoRedoKeyboardShortcut();

  const canvasSize = ["224px", "256px", "320px", "512px", "640px", "768px", "960px"];

  return (
    <Center {...props} onMouseDown={handleMouseEvent} onMouseUp={handleMouseEvent} onMouseMove={handleMouseEvent}>
      {activePart ? (
        <Box position="relative" w={canvasSize} h={canvasSize} {...checkerboardBg}>
          <PixelArtCanvas style={{ width: "100%", height: "100%" }} id="working-canvas" ref={workingCanvasRef} />
          <PixelArtCanvas style={{ width: "100%", height: "100%" }} id="tmp-canvas" ref={tmpCanvasRef} />
        </Box>
      ) : (
        <Text>Select a part to edit</Text>
      )}
    </Center>
  );
};

type CanvasProps = {
  activePart: NounPart;
};

const useUndoRedoKeyboardShortcut = () => {
  const { activePart } = useNounState();
  const { workingCanvasRef } = useWorkspaceState();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePart) {
        return;
      }

      const activePartState = useNounState.getState()[activePart];
      if (!activePartState.canvas || !workingCanvasRef.current || (!e.ctrlKey && !e.metaKey) || !["z", "Z"].includes(e.key)) {
        return;
      }

      if (e.shiftKey ? !activePartState.canRedo : !activePartState.canUndo) {
        return;
      }

      const blob = e.shiftKey ? activePartState.redo() : activePartState.undo();
      replaceCanvasWithBlob(blob, workingCanvasRef.current);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePart]);
};

const useCopyActivePartToWorkingCanvas = () => {
  const { activePart, ...partsState } = useNounState();
  const { workingCanvasRef } = useWorkspaceState();
  useEffect(() => {
    if (!workingCanvasRef.current || !activePart) return;
    replaceCanvasWithBlob(partsState[activePart].blob(), workingCanvasRef.current);
  }, [activePart]);
};
