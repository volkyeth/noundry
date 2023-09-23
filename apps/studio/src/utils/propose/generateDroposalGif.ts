import GIF from "gif.js";
import { DROPOSAL_IMAGE_SIZE } from "../../constants/proposal";
import { NounPartType } from "../../types/noun";
import { drawCanvas } from "../canvas/drawCanvas";
import { nounParts } from "../constants";
import { drawPartFromSeed, getRandomSeed } from "../nounAssets";

export const generateDroposalGif = async (staticPart: NounPartType, staticPartBitmap: ImageBitmap) => {
  const gif = new GIF({
    workers: 4,
    quality: 1,
    width: DROPOSAL_IMAGE_SIZE,
    height: DROPOSAL_IMAGE_SIZE,
    workerScript: "/gif.worker.js",
  });

  for (let i = 0; i < 200; i++) {
    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = DROPOSAL_IMAGE_SIZE;
    frameCanvas.height = DROPOSAL_IMAGE_SIZE;
    for (const currentPart of nounParts) {
      if (currentPart === staticPart) {
        drawCanvas(staticPartBitmap, frameCanvas);
        continue;
      }

      await drawPartFromSeed(currentPart, getRandomSeed(currentPart), frameCanvas);
    }

    gif.addFrame(frameCanvas, { delay: 100 });
  }

  return new Promise<Blob>((resolve) => {
    gif.on("finished", resolve);
    gif.render();
  });
};
