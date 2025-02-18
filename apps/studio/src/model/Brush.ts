import { create } from "zustand";
import { Color } from "../tools/tools";
import { Point } from "../types/geometry";

export type BrushState = {
  brushSize: number;
  setBrushSize: (brushSize: number) => void;
  strokeColor: Color;
  setStrokeColor: (color: Color) => void;
  previousStrokeColor: Color;
  setPreviousStrokeColor: (color: Color) => void;
  fillColor: Color;
  setFillColor: (color: Color) => void;
  previousFillColor: Color;
  setPreviousFillColor: (color: Color) => void;
  activeColor: "stroke" | "fill";
  setActiveColor: (color: "stroke" | "fill") => void;
};

export const useBrush = create<BrushState>()((set) => ({
  brushSize: 1,
  setBrushSize: (brushSize: number) => set({ brushSize }),
  strokeColor: "#000000",
  setStrokeColor: (color: Color) => set({ strokeColor: color }),
  previousStrokeColor: "#000000",
  setPreviousStrokeColor: (color: Color) => set({ previousStrokeColor: color }),
  fillColor: "#00000000",
  setFillColor: (color: Color) => set({ fillColor: color }),
  previousFillColor: "#00000000",
  setPreviousFillColor: (color: Color) => set({ previousFillColor: color }),
  activeColor: "stroke",
  setActiveColor: (color: "stroke" | "fill") => set({ activeColor: color }),
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
