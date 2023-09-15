import { create } from "zustand";
import { Point } from "../types/geometry";

export type CursorState = {
  pathPoints: Point[];
  clickingLeft: boolean;
};

export const useCursor = create<CursorState>()(() => ({
  pathPoints: [],
  clickingLeft: false,
}));
