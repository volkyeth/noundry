import { create } from "zustand";
import { Color } from "../tools/tools";
import { Point } from "../types/geometry";

export type BrushState = {
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  fgColor: Color;
  setFgColor: (color: Color) => void;
  bgColor: Color;
  setBgColor: (color: Color) => void;
};

export const useBrush = create<BrushState>()((set) => ({
  brushSize: 1,
  setBrushSize: (brushSize: number) => set({ brushSize }),
  fgColor: "#000000",
  setFgColor: (color: Color) => set({ fgColor: color }),
  bgColor: "#00000000",
  setBgColor: (color: Color) => set({ bgColor: color }),
}));

export const Brush = {
  drawHover: (point: Point, canvas: HTMLCanvasElement) => {
    const { brushSize } = useBrush.getState();
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff70";
    ctx.globalCompositeOperation = "difference";
    ctx.fillRect(point.x - brushSize + 1, point.y - brushSize + 1, brushSize, brushSize);
    ctx.globalCompositeOperation = "source-over";
  },
};
