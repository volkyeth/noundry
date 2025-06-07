import { create } from "zustand";
import { NounPartMapping, NounPartType } from "../types/noun";
import { NounSeed } from "../utils/assetImports";
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
  remixedFrom: string | null;
  customPart: NounPartType | null;
  loadSeed: (seed: NounSeed) => Promise<void>;
  initializeWithParams: (params: { [K in NounPartType]?: { type: 'seed'; value: number } | { type: 'imageUri'; value: string } }, remixedFrom?: string) => Promise<void>;
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
    remixedFrom: null,
    customPart: null,
    loadSeed: async (seed: NounSeed) => {
      const state = get();

      await Promise.all(
        Object.entries(seed).map(([part, partSeed]) =>
          state[part as NounPartType].loadPart(partSeed)
        )
      );
    },
    initializeWithParams: async (params: { [K in NounPartType]?: { type: 'seed'; value: number } | { type: 'imageUri'; value: string } }, remixedFrom?: string) => {
      const state = get();

      // Find the part with imageUri (the custom trait)
      let customPartType: NounPartType | null = null;
      for (const partType of nounParts) {
        const param = params[partType];
        if (param?.type === 'imageUri') {
          customPartType = partType;
          break;
        }
      }

      // Set remixedFrom reference and customPart
      set({ 
        remixedFrom: remixedFrom || null,
        customPart: customPartType
      });

      // Initialize each part based on URL params or randomize if not provided
      await Promise.all(
        nounParts.map(async (partType) => {
          const param = params[partType];
          if (param) {
            if (param.type === 'seed') {
              await state[partType].loadPart(param.value);
            } else if (param.type === 'imageUri') {
              await state[partType].loadFromImageUri(param.value);
            }
          } else {
            // No URL param for this part, randomize it
            state[partType].randomize();
          }
        })
      );

      // Activate the custom part layer if one was found
      if (customPartType) {
        set({ activePart: customPartType });
      }
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
