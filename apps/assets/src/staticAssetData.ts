import type { EncodedTrait, HexColor, OnchainArtwork, Palette } from "noggles";
import lilNounsImageDataJson from "../../../packages/lil-nouns-assets/src/image-data.json";
import nounsImageDataJson from "../../../packages/nouns-assets/src/image-data.json";

type PackageImageData = {
  bgcolors: string[];
  palette: string[];
  images: {
    bodies: { filename: string; data: string }[];
    accessories: { filename: string; data: string }[];
    heads: { filename: string; data: string }[];
    glasses: { filename: string; data: string }[];
  };
};

export const nounsImageData = nounsImageDataJson as PackageImageData;
export const lilNounsImageData = lilNounsImageDataJson as PackageImageData;

export const nounsArtData = toArtData(nounsImageData);
export const lilNounsArtData = toArtData(lilNounsImageData);

function toArtData(imageData: PackageImageData): OnchainArtwork {
  return {
    bodies: toEncodedTraits(imageData.images.bodies),
    accessories: toEncodedTraits(imageData.images.accessories),
    heads: toEncodedTraits(imageData.images.heads),
    glasses: toEncodedTraits(imageData.images.glasses),
    backgrounds: imageData.bgcolors.map((color) => `#${color}` as HexColor),
    palettes: [toPalette(imageData.palette)],
  };
}

function toEncodedTraits(
  traits: PackageImageData["images"]["bodies"]
): EncodedTrait[] {
  return traits.map((trait) => trait.data as EncodedTrait);
}

function toPalette(colors: string[]): Palette {
  return colors.map((color, index) => {
    if (index === 0 && color === "") return "#00000000" as HexColor;
    return `#${color}` as HexColor;
  });
}
