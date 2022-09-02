import { ImageData, getNounData } from "@nouns/assets";
import { NounSeed } from "@nouns/assets/dist/types";
import { buildSVG, EncodedImage } from "@nouns/sdk";
import { fillCanvas, getBlob, replaceCanvasWithBlob } from "../utils/canvas";
import { NounPart } from "../utils/constants";
import { drawNoun, NounState } from "./nounState";

export type NounPartState = {
  visible: boolean;
  part: string;
  canvas: HTMLCanvasElement;
  history: Blob[];
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  commit: () => void;
  undo: () => Blob;
  redo: () => Blob;
  blob: () => Blob;
  toggleVisibility: () => void;
};

type PartialUpdate<T> = T | Partial<T> | ((state: T) => T | Partial<T>);
type Set<T> = (partial: PartialUpdate<T>, replace?: boolean | undefined) => void;

const moveToHistory = (part: NounPart, get: () => NounState, index: number) => {
  const state = get();
  const partState = state[part];

  if (!partState.history[index]) {
    throw "Can't move to inexistent history position";
  }
  const blob = partState.history[index];

  replaceCanvasWithBlob(blob, partState.canvas).then(() => {
    drawNoun(state);
  });

  return {
    currentHistoryIndex: index,
    canUndo: index > 0,
    canRedo: index < partState.history.length - 1,
    blob: () => blob,
  };
};

const scopedSet = (part: NounPart, set: Set<NounState>) => (partial: PartialUpdate<NounPartState>) => {
  set((prev) => {
    const updatedPartState = typeof partial === "function" ? partial(prev[part]) : partial;
    return {
      [part]: { ...prev[part], ...updatedPartState },
    };
  });
};

const drawPart = async (part: EncodedImage, canvas: HTMLCanvasElement) => {
  const { palette } = ImageData;
  const svgString = buildSVG([part], palette, "00000000");

  const img = new Image();

  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };

    img.onerror = reject;

    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  });
};

export const createNounPart = (part: NounPart, seed: NounSeed, set: Set<NounState>, get: () => NounState): NounPartState => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  drawPartFromSeed(part, seed, canvas)
    .then(() => getBlob(canvas))
    .then((blob) => {
      scopedSet(
        part,
        set
      )({
        history: [blob],
        currentHistoryIndex: 0,
        blob: () => blob,
      });
      drawNoun(get());
    });

  return {
    visible: true,
    part,
    canvas,
    history: [],
    currentHistoryIndex: -1,
    canUndo: false,
    canRedo: false,
    blob: () => {
      throw "History not initialized yet";
    },
    // Redraws the Noun and pushes current canvas content to history
    commit: async () => {
      const state = get();
      drawNoun(state);
      const canvas = state[part].canvas;

      await getBlob(canvas).then((blob) => {
        scopedSet(
          part,
          set
        )((state) => {
          return {
            history: [...state.history.slice(0, state.currentHistoryIndex + 1), blob],
            canUndo: state.currentHistoryIndex + 1 > 0,
            canRedo: false,
            currentHistoryIndex: state.currentHistoryIndex + 1,
            blob: () => blob,
          };
        });
      });
    },
    undo: () => {
      scopedSet(
        part,
        set
      )((state) => {
        const canvas = state.canvas;
        if (!canvas || !state.canUndo) {
          return state;
        }

        return moveToHistory(part, get, state.currentHistoryIndex - 1);
      });

      console.log(get()[part]);

      return get()[part].blob();
    },
    redo: () => {
      scopedSet(
        part,
        set
      )((state) => {
        const canvas = state.canvas;
        if (!canvas || !state.canRedo) {
          return state;
        }

        return moveToHistory(part, get, state.currentHistoryIndex + 1);
      });

      return get()[part].blob();
    },
    toggleVisibility: () => {
      scopedSet(part, set)((state) => ({ visible: !state.visible }));
      drawNoun(get());
    },
  };
};

const drawPartFromSeed = async (part: NounPart, seed: NounSeed, canvas: HTMLCanvasElement) => {
  const {
    background,
    parts: [body, accessory, head, glasses],
  } = getNounData(seed);

  if (part === "background") {
    fillCanvas(canvas, `#${background}`);
    return;
  }

  const parts = {
    body,
    accessory,
    head,
    glasses,
  };

  await drawPart(parts[part], canvas);
};
