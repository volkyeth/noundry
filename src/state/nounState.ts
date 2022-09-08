import { createRef, RefObject } from "react";
import { NounPart, NounPartMapping, nounParts } from "../utils/constants";
import create from "zustand";
import { clearCanvas, drawCanvas, fillCanvas, replaceCanvasWithBlob, scaleCanvas } from "../utils/canvas";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData, getRandomNounSeed } from "@nouns/assets";
import { buildSVG, EncodedImage } from "@nouns/sdk";
import { createNounPart, NounPartState } from "./nounPartState";

export type NounState = {
  activePart: NounPart | null;
  background: NounPartState;
  body: NounPartState;
  head: NounPartState;
  accessory: NounPartState;
  glasses: NounPartState;
  canvas: HTMLCanvasElement | null;
  loadSeed: (seed: NounSeed) => Promise<void>;
  randomize: () => void;
  canvasRef: (canvas: null | HTMLCanvasElement) => void;
  activatePart: (part: NounPart) => void;
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
    ...parts,
    canvas: null,
    loadSeed: async (seed: NounSeed) => {
      const state = get();

      await Promise.all(Object.entries(seed).map(([part, partSeed]) => state[part as NounPart].loadPart(partSeed)));
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
        drawNoun(state);
        return { canvas };
      });
    },
    activatePart: (part: NounPart) => set({ activePart: part }),
  };
});

export const drawNoun = (state: NounState) => {
  if (!state.canvas) {
    return;
  }
  clearCanvas(state.canvas);
  for (const part of nounParts) {
    if (!state[part].visible) {
      continue;
    }
    drawCanvas(state[part].canvas, state.canvas);
  }
};
