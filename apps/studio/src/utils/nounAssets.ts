import { ImageData } from "@nouns/assets";
import { EncodedImage, buildSVG } from "@nouns/sdk";
import { NounPartType } from "../types/noun";
import { clearCanvas } from "./canvas/clearCanvas";
import { drawCanvas } from "./canvas/drawCanvas";
import { fillCanvas } from "./canvas/fillCanvas";

export const getRandomSeed = (part: NounPartType) => {
  return Math.floor(Math.random() * amountOfParts(part));
};

export const amountOfParts = (partType: NounPartType) => {
  const { bgcolors, images } = ImageData;
  const { bodies, accessories, heads, glasses } = images;

  switch (partType) {
    case "background":
      return bgcolors.length;
    case "body":
      return bodies.length;
    case "accessory":
      return accessories.length;
    case "head":
      return heads.length;
    case "glasses":
      return glasses.length;
  }
};

export const drawPart = async (
  part: EncodedImage,
  canvas: HTMLCanvasElement
) => {
  const { palette } = ImageData;
  const svgString = buildSVG([part], palette, "00000000");

  const img = new Image();

  return new Promise<void>((resolve, reject) => {
    img.onload = () => {
      drawCanvas(img, canvas);
      resolve();
    };

    img.onerror = reject;

    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  });
};

export const drawPartFromSeed = async (
  part: NounPartType,
  seed: number,
  canvas: HTMLCanvasElement
) => {
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
