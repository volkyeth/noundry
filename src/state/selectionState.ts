import create from "zustand";
import { Point, toString } from "../utils/canvas";
import { unionBy } from "lodash";

export type SelectionState = {
  selectedPoints: Point[];
  hasSelection: () => boolean;
  setSelection: (points: Point[]) => void;
  setRectSelection: (start: Point, end: Point) => void;
  shiftSelection: (xOffset: number, yOffset: number) => void;
  addRectSelection: (start: Point, end: Point) => void;
  removeRectSelection: (start: Point, end: Point) => void;
  addSelection: (points: Point[]) => void;
  removeSelection: (points: Point[]) => void;
  clearSelection: () => void;
  previousSelection: Point[];
  saveSelection: () => void;
  restoreSelection: () => void;
};

export const useSelectionState = create<SelectionState>()((set, get) => ({
  selectedPoints: [],
  hasSelection: () => get().selectedPoints.length > 0,
  clearSelection: () => set({ selectedPoints: [] }),
  setSelection: (selectedPoints: Point[]) => set({ selectedPoints }),
  setRectSelection: (start: Point, end: Point) => {
    const selectedPoints = getRectPoints(start, end);
    set({ selectedPoints });
  },
  shiftSelection: (xOffset: number, yOffset: number) =>
    set((state) => ({
      selectedPoints: state.selectedPoints.map((point) => ({ x: point.x + xOffset, y: point.y + yOffset })),
    })),
  addSelection: (points: Point[]) => set((state) => ({ selectedPoints: unionBy(state.selectedPoints, points, toString) })),
  addRectSelection: (start: Point, end: Point) =>
    set((state) => ({ selectedPoints: unionBy(state.selectedPoints, getRectPoints(start, end), toString) })),
  removeSelection: (points: Point[]) =>
    set((state) => {
      const remove = points.map(toString);
      return { selectedPoints: state.selectedPoints.filter((point) => !remove.includes(toString(point))) };
    }),
  removeRectSelection: (start: Point, end: Point) =>
    set((state) => {
      const remove = getRectPoints(start, end).map(toString);
      return { selectedPoints: state.selectedPoints.filter((point) => !remove.includes(toString(point))) };
    }),
  previousSelection: [],
  saveSelection: () => {
    set((state) => {
      return { previousSelection: state.selectedPoints };
    });
  },
  restoreSelection: () => {
    set((state) => {
      return { selectedPoints: state.previousSelection };
    });
  },
}));

const getRectPoints = (a: Point, b: Point): Point[] => {
  const points: Point[] = [];
  const start = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) };
  const end = { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) };

  for (let x = start.x; x <= end.x; x++) {
    for (let y = start.y; y <= end.y; y++) {
      points.push({ x, y });
    }
  }

  return points;
};
