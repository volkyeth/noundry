import { NounPartType } from "../types/noun";
import { clearCanvas } from "../utils/canvas/clearCanvas";
import { getImageData } from "../utils/canvas/getImageData";
import { loadFromImageUri } from "../utils/canvas/loadFromImageUri";
import { replaceCanvasWithImageData } from "../utils/canvas/replaceCanvasWithImageData";
import { imageDataAreEqual } from "../utils/canvas/imageDataAreEqual";
import { drawPartFromSeed, getRandomSeed } from "../utils/nounAssets";
import { NounState, drawNounCanvas } from "./Noun";

export type NounPartState = {
  visible: boolean;
  part: NounPartType;
  canvas: HTMLCanvasElement;
  history: { imageData: ImageData; seed: number | null }[];
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  edited: boolean;
  seed: number | null;
  loadPart: (seed: number) => Promise<void>;
  loadFromImageUri: (imageUri: string) => Promise<void>;
  clear: () => void;
  randomize: () => void;
  commit: () => void;
  undo: () => void;
  redo: () => void;
  getImageData: () => ImageData;
  toggleVisibility: () => void;
};

type PartialUpdate<T> = T | Partial<T> | ((state: T) => T | Partial<T>);
type Set<T> = (
  partial: PartialUpdate<T>,
  replace?: boolean | undefined
) => void;

const moveToHistory = (
  part: NounPartType,
  get: () => NounState,
  index: number
) => {
  const state = get();
  const partState = state[part];

  if (!partState.history[index]) {
    throw "Can't move to inexistent history position";
  }
  const historyItem = partState.history[index];

  replaceCanvasWithImageData(historyItem.imageData, partState.canvas);

  return {
    currentHistoryIndex: index,
    canUndo: index > 0,
    canRedo: index < partState.history.length - 1,
    getImageData: () => historyItem.imageData,
    seed: historyItem.seed,
  };
};

const scopedSet =
  (part: NounPartType, set: Set<NounState>) =>
    (partial: PartialUpdate<NounPartState>) => {
      set((prev) => {
        const updatedPartState =
          typeof partial === "function" ? partial(prev[part]) : partial;
        return {
          [part]: { ...prev[part], ...updatedPartState },
        };
      });
    };

export const createNounPart = (
  part: NounPartType,
  set: Set<NounState>,
  get: () => NounState
): NounPartState => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  canvas.getContext("2d", { willReadFrequently: true });

  return {
    visible: true,
    part,
    canvas,
    history: [],
    currentHistoryIndex: -1,
    canUndo: false,
    canRedo: false,
    edited: false,
    seed: null,
    clear: () => {
      clearCanvas(canvas);
      get()[part].commit();
      scopedSet(part, set)({ seed: null });
    },
    randomize: () => {
      clearCanvas(canvas);
      const newSeed = getRandomSeed(part);
      drawPartFromSeed(part, newSeed, canvas).then(() => {
        get()[part].commit();
        scopedSet(part, set)({ edited: false, seed: newSeed });
      });
    },
    loadPart: async (seed: number) => {
      clearCanvas(canvas);
      await drawPartFromSeed(part, seed, canvas).then(() => {
        get()[part].commit();
        scopedSet(part, set)({ edited: false, seed });
      });
    },
    loadFromImageUri: async (imageUri: string) => {
      await loadFromImageUri(imageUri, canvas).then(() => {
        get()[part].commit();
        scopedSet(part, set)({ edited: true, seed: null });
      });
    },
    getImageData: () => {
      const currentHistoryItem = get()[part].history[get()[part].currentHistoryIndex];
      if (currentHistoryItem) {
        return currentHistoryItem.imageData;
      }
      throw "History not initialized yet";
    },
    // Redraws the Noun and pushes current canvas content to history
    commit: () => {
      const imageData = getImageData(canvas);
      const partState = get()[part];
      const currentSeed = partState.seed;

      const currentImageData = partState.history[partState.currentHistoryIndex]?.imageData;

      if (currentImageData && imageDataAreEqual(imageData, currentImageData)) {
        return;
      }

      scopedSet(
        part,
        set
      )((state) => {
        return {
          history: [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            { imageData, seed: currentSeed },
          ],
          canUndo: state.currentHistoryIndex + 1 > 0,
          canRedo: false,
          edited: true,
          currentHistoryIndex: state.currentHistoryIndex + 1,
          getImageData: () => imageData,
        };
      });
      drawNounCanvas(get());
    },
    undo: () => {
      const state = get()[part];
      if (!state.canUndo) {
        return;
      }
      const updatedState = moveToHistory(part, get, state.currentHistoryIndex - 1);
      scopedSet(part, set)(updatedState);
      drawNounCanvas(get());
    },
    redo: () => {
      const state = get()[part];
      if (!state.canRedo) {
        return;
      }
      const updatedState = moveToHistory(part, get, state.currentHistoryIndex + 1);
      scopedSet(part, set)(updatedState);
      drawNounCanvas(get());
    },
    toggleVisibility: () => {
      scopedSet(part, set)((state) => ({ visible: !state.visible }));
      drawNounCanvas(get());
    },
  };
};

