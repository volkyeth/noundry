import { NounSeed } from "@nouns/assets/dist/types";
import { create } from "zustand";
import { NounPartMapping, NounPartType } from "../types/noun";
import { clearCanvas } from "../utils/canvas/clearCanvas";
import { drawCanvas } from "../utils/canvas/drawCanvas";
import { nounParts } from "../utils/constants";
import { NounPartState, createNounPart } from "./NounPart";
import { useWorkspaceState } from "./Workspace";

export type NounState = {
  activePart: NounPartType | null;
  getActivePartState: () => NounPartState | null;
  background: NounPartState;
  body: NounPartState;
  head: NounPartState;
  accessory: NounPartState;
  glasses: NounPartState;
  canvas: HTMLCanvasElement | null;
  loadSeed: (seed: NounSeed) => Promise<void>;
  randomize: () => void;
  canvasRef: (canvas: null | HTMLCanvasElement) => void;
  activatePart: (part: NounPartType) => void;
};

export const useNounState = create<NounState>()((set, get) => {
  const parts = {
    background: createNounPart("background", set, get),
    body: createNounPart("body", set, get),
    head: createNounPart("head", set, get),
    accessory: createNounPart("accessory", set, get),
    glasses: createNounPart("glasses", set, get),
  } as NounPartMapping<NounPartState>;

  for (const part of Object.values(parts)) {
    part.randomize();
  }

  return {
    activePart: null,
    getActivePartState: () => {
      const nounState = get();
      if (!nounState.activePart) {
        return null;
      }

      return nounState[nounState.activePart];
    },
    ...parts,
    canvas: null,
    loadSeed: async (seed: NounSeed) => {
      const state = get();

      await Promise.all(
        Object.entries(seed).map(([part, partSeed]) =>
          state[part as NounPartType].loadPart(partSeed)
        )
      );
    },
    randomize: () => {
      const state = get();
      nounParts.forEach((part) => {
        if (!state[part].edited) {
          state[part].randomize();
        }
      });
    },
    canvasRef: async (canvas: HTMLCanvasElement | null) => {
      if (!canvas) {
        set({ canvas: null });
        return;
      }

      set((state) => {
        drawNounCanvas(state);
        return { canvas };
      });
    },
    activatePart: (part: NounPartType) => set({ activePart: part }),
  };
});

export const drawNounCanvas = (state: NounState) => {
  if (!state.canvas) {
    return;
  }
  const workingCanvas = useWorkspaceState.getState().canvas!;
  clearCanvas(state.canvas);
  for (const part of nounParts) {
    if (!state[part].visible) {
      continue;
    }

    state.activePart === part ? drawCanvas(workingCanvas, state.canvas) :
    drawCanvas(state[part].canvas, state.canvas);
  }
};

export const drawNoun = (
  parts: NounPartMapping<HTMLCanvasElement>,
  targetCanvas: HTMLCanvasElement
) => {
  clearCanvas(targetCanvas);
  for (const part of nounParts) {
    drawCanvas(parts[part], targetCanvas);
  }
};
