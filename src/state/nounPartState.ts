import { ImageData, getNounData } from "@nouns/assets";
import { NounSeed } from "@nouns/assets/dist/types";
import { buildSVG, EncodedImage } from "@nouns/sdk";
import { clearCanvas, fillCanvas, getBlob, replaceCanvasWithBlob } from "../utils/canvas";
import { NounPart, NounPartMapping } from "../utils/constants";
import { drawNoun, NounState, useNounState } from "./nounState";

export type NounPartState = {
  visible: boolean;
  part: NounPart;
  canvas: HTMLCanvasElement;
  history: Blob[];
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  edited: boolean;
  loadPart: (seed: number) => Promise<void>;
  clear: () => void;
  randomize: () => void;
  commit: () => Promise<void>;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  blob: () => Blob;
  toggleVisibility: () => void;
};

type PartialUpdate<T> = T | Partial<T> | ((state: T) => T | Partial<T>);
type Set<T> = (partial: PartialUpdate<T>, replace?: boolean | undefined) => void;

const moveToHistory = async (part: NounPart, get: () => NounState, index: number) => {
  const state = get();
  const partState = state[part];

  if (!partState.history[index]) {
    throw "Can't move to inexistent history position";
  }
  const blob = partState.history[index];

  await replaceCanvasWithBlob(blob, partState.canvas).then(() => {
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
      clearCanvas(canvas);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve();
    };

    img.onerror = reject;

    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  });
};

export const createNounPart = (part: NounPart, set: Set<NounState>, get: () => NounState): NounPartState => {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;

  return {
    visible: true,
    part,
    canvas,
    history: [],
    currentHistoryIndex: -1,
    canUndo: false,
    canRedo: false,
    edited: false,
    clear: async () => {
      clearCanvas(canvas);
      await get()[part].commit();
    },
    randomize: () => {
      clearCanvas(canvas);
      drawPartFromSeed(part, getRandomSeed(part), canvas).then(async () => {
        await get()[part].commit();
        scopedSet(part, set)({ edited: false });
      });
    },
    loadPart: async (seed: number) => {
      await drawPartFromSeed(part, seed, canvas).then(async () => {
        await get()
          [part].commit()
          .then(() => scopedSet(part, set)({ edited: false }));
      });
    },
    blob: () => {
      throw "History not initialized yet";
    },
    // Redraws the Noun and pushes current canvas content to history
    commit: async () => {
      drawNoun(get());
      await getBlob(canvas).then(async (blob) => {
        const partState = get()[part];

        const currentBlob = partState.history[partState.currentHistoryIndex];

        if (currentBlob && (await blobsAreEqual(blob, currentBlob))) {
          return;
        }

        scopedSet(
          part,
          set
        )((state) => {
          return {
            history: [...state.history.slice(0, state.currentHistoryIndex + 1), blob],
            canUndo: state.currentHistoryIndex + 1 > 0,
            canRedo: false,
            edited: true,
            currentHistoryIndex: state.currentHistoryIndex + 1,
            blob: () => blob,
          };
        });
      });
    },
    undo: async () => {
      const state = get()[part];
      if (!state.canUndo) {
        return;
      }
      return moveToHistory(part, get, state.currentHistoryIndex - 1).then((updatedState) => {
        scopedSet(part, set)(updatedState);
      });
    },
    redo: async () => {
      const state = get()[part];
      if (!state.canRedo) {
        return;
      }
      return moveToHistory(part, get, state.currentHistoryIndex + 1).then((updatedState) => {
        scopedSet(part, set)(updatedState);
      });
    },
    toggleVisibility: () => {
      scopedSet(part, set)((state) => ({ visible: !state.visible }));
      drawNoun(get());
    },
  };
};

const getRandomSeed = (part: NounPart) => {
  const { bgcolors, images } = ImageData;
  const { bodies, accessories, heads, glasses } = images;

  const availableParts = {
    background: bgcolors.length,
    body: bodies.length,
    accessory: accessories.length,
    head: heads.length,
    glasses: glasses.length,
  };

  return Math.floor(Math.random() * availableParts[part]);
};

const drawPartFromSeed = async (part: NounPart, seed: number, canvas: HTMLCanvasElement) => {
  if (part === "background") {
    const background = ImageData.bgcolors[seed];
    if (!background) throw `there's no background with index ${seed}`;
    clearCanvas(canvas);
    fillCanvas(canvas, `#${background}`);
    return;
  }

  const partImage = {
    head: ImageData.images.heads,
    body: ImageData.images.bodies,
    accessory: ImageData.images.accessories,
    glasses: ImageData.images.glasses,
  }[part][seed] as EncodedImage;

  if (!partImage) throw `there's no ${part} with index ${seed}`;
  await drawPart(partImage, canvas);
};

const blobsAreEqual = async (blobA: Blob, blobB: Blob) => {
  return Promise.all([blobA.arrayBuffer(), blobB.arrayBuffer()]).then(([buf1, buf2]) => {
    if (buf1 === buf2) {
      return true;
    }
    if (buf1.byteLength !== buf2.byteLength) return false;

    const d1 = new DataView(buf1),
      d2 = new DataView(buf2);

    var i = buf1.byteLength;
    while (i--) {
      if (d1.getUint8(i) !== d2.getUint8(i)) return false;
    }

    return true;
  });
};
