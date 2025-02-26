import { create } from "zustand";
import { Color } from "../tools/tools";
import { Point } from "../types/geometry";

export type BrushState = {
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  color: Color;
  setColor: (color: Color) => void;
  previousColor: Color;
  setPreviousColor: (color: Color) => void;
};

export const useBrush = create<BrushState>()((set) => ({
  brushSize: 1,
  setBrushSize: (brushSize: number) => set({ brushSize }),
  color: "#000000",
  setColor: (color: Color) => set({ color }),
  previousColor: "#000000",
  setPreviousColor: (color: Color) => set({ previousColor: color }),
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
