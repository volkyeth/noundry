import { create } from "zustand";
import { Color } from "../tools/tools";

export type BrushState = {
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  fgColor: Color;
  setFgColor: (color: Color) => void;
  bgColor: Color;
  setBgColor: (color: Color) => void;
};

export const useBrushState = create<BrushState>()((set) => ({
  brushSize: 1,
  setBrushSize: (brushSize: number) => set({ brushSize }),
  fgColor: "#000000",
  setFgColor: (color: Color) => set({ fgColor: color }),
  bgColor: "#00000000",
  setBgColor: (color: Color) => set({ bgColor: color }),
}));
