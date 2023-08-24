import { create } from "zustand";
import { withSelectionClip } from "../tools/tools";
import { clearCanvas, drawCanvas } from "../utils/canvas";

export type ClipboardState = {
  clipboardCanvas: HTMLCanvasElement;
  placingCanvas: HTMLCanvasElement;
  resetPlacing: () => void;
  placing: boolean;
  place: (destinationCanvas: HTMLCanvasElement) => void;
  placeOffset: { x: number; y: number };
  offsetPlacing: (xOffset: number, yOffset: number) => void;
  saveSelectionToClipboard: (sourceCanvas: HTMLCanvasElement) => void;
  placeFromClipboard: () => void;
  placeFromSelection: (canvas: HTMLCanvasElement) => void;
};

export const useClipboardState = create<ClipboardState>()((set, get) => {
  const clipboardCanvas = document.createElement("canvas");
  clipboardCanvas.width = 32;
  clipboardCanvas.height = 32;
  const placingCanvas = document.createElement("canvas");
  placingCanvas.width = 32;
  placingCanvas.height = 32;
  return {
    clipboardCanvas,
    placingCanvas,
    placing: false,
    placeOffset: { x: 0, y: 0 },
    offsetPlacing: (xOffset: number, yOffset: number) => {
      set((state) => {
        const { placeOffset } = state;
        return { placeOffset: { x: placeOffset.x + xOffset, y: placeOffset.y + yOffset } };
      });
    },
    saveSelectionToClipboard: (sourceCanvas) => {
      const { clipboardCanvas } = get();
      const ctx = clipboardCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, clipboardCanvas.width, clipboardCanvas.height);
      withSelectionClip(ctx, () => {
        ctx.drawImage(sourceCanvas, 0, 0);
      });
    },
    resetPlacing: () => {
      set((state) => {
        if (state.placingCanvas) {
          clearCanvas(state.placingCanvas);
        }

        return { placing: false, placeOffset: { x: 0, y: 0 } };
      });
    },
    placeFromClipboard: () => {
      const { clipboardCanvas, placingCanvas, resetPlacing } = get();
      if (!placingCanvas) {
        return;
      }
      resetPlacing();
      drawCanvas(clipboardCanvas, placingCanvas);
      set({ placing: true });
    },
    placeFromSelection: (canvas) => {
      const { placingCanvas, resetPlacing } = get();
      resetPlacing();
      withSelectionClip(placingCanvas.getContext("2d")!, () => {
        drawCanvas(canvas, placingCanvas);
      });
      set({ placing: true });
    },
    place: (destinationCanvas) => {
      const { placingCanvas, resetPlacing, placeOffset } = get();
      if (!placingCanvas) {
        return;
      }
      const { x, y } = placeOffset;
      drawCanvas(placingCanvas, destinationCanvas, x, y);
      resetPlacing();
    },
  };
});
