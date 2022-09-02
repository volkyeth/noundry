import { createRef, RefObject } from "react";
import { NounPart, NounPartMapping, nounParts } from "../utils/constants";
import create from "zustand";
import { clearCanvas, drawCanvas, fillCanvas, replaceCanvasWithBlob, scaleCanvas } from "../utils/canvas";
import { NounSeed } from "@nouns/assets/dist/types";
import { ImageData, getNounData, getRandomNounSeed } from "@nouns/assets";
import { buildSVG, EncodedImage } from "@nouns/sdk";
import { createNounPart, NounPartState } from "./nounPartState";

export type NounState = {
  seed: NounSeed;
  activePart: NounPart | null;
  background: NounPartState;
  body: NounPartState;
  head: NounPartState;
  accessory: NounPartState;
  glasses: NounPartState;
  canvas: HTMLCanvasElement | null;
  canvasRef: (canvas: null | HTMLCanvasElement) => void;
  activatePart: (part: NounPart) => void;
};

export const useNounState = create<NounState>()((set, get) => {
  const seed = getRandomNounSeed();

  return {
    seed,
    activePart: null,
    background: createNounPart("background", seed, set, get),
    body: createNounPart("body", seed, set, get),
    head: createNounPart("head", seed, set, get),
    accessory: createNounPart("accessory", seed, set, get),
    glasses: createNounPart("glasses", seed, set, get),
    canvas: null,
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
