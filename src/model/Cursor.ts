import { create } from "zustand";
import { Point } from "../utils/canvas";

export type CursorState = {
  pathPoints: Point[];
  clickingLeft: boolean;
};

export const useCursor = create<CursorState>()(() => ({
  pathPoints: [],
  clickingLeft: false,
}));
