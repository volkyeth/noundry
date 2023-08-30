import { create } from "zustand";
import { useSelection } from "./Selection";

export type ClipboardState = {
  clipboardCanvas: HTMLCanvasElement;
  hasClipboard: () => boolean;
  saveSelectionToClipboard: () => void;
};

export const useClipboardState = create<ClipboardState>()((set, get) => {
  const clipboardCanvas = document.createElement("canvas");
  clipboardCanvas.width = 32;
  clipboardCanvas.height = 32;

  return {
    clipboardCanvas,
    saveSelectionToClipboard: () => {
      const { saveSelectionTo } = useSelection.getState();
      saveSelectionTo(get().clipboardCanvas);
    },
    hasClipboard: () => {
      const { clipboardCanvas } = get();
      const ctx = clipboardCanvas.getContext("2d")!;
      const data = ctx.getImageData(0, 0, clipboardCanvas.width, clipboardCanvas.height).data;
      return data.some((d) => d !== 0);
    },
  };
});
