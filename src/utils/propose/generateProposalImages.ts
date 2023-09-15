import { AMOUNT_PROPOSAL_GALLERY_IMAGES, PROPOSAL_GALLERY_IMAGE_SIZE, PROPOSAL_MAIN_IMAGE_SIZE } from "../../constants/proposal";
import { NounPartType } from "../../types/noun";
import { drawCanvas } from "../canvas/drawCanvas";
import { nounParts } from "../constants";
import { getNftStorageClient } from "../ipfs";
import { drawPartFromSeed, getRandomSeed } from "../nounAssets";
import { generateDroposalGif } from "./generateDroposalGif";

export type ProposalImages = Awaited<ReturnType<typeof generateProposalImages>>;

export const generateProposalImages = async (partType: NounPartType, partBitmap: ImageBitmap) => {
  const galleryImages = await Promise.all(new Array(AMOUNT_PROPOSAL_GALLERY_IMAGES).fill(null).map(() => generateGalleryImage(partType, partBitmap)));
  const editionArtwork = await generateDroposalGif(partType, partBitmap);
  const mainImage = await generateMainImage(partType, partBitmap);
  const editionArtworkFilename = "edition.gif";
  const mainImageFilename = "part.png";
  const storageClient = getNftStorageClient();
  const cid = await storageClient.storeDirectory([
    ...galleryImages.map((blob, i) => new File([blob], galleryImageFilename(i))),
    new File([editionArtwork], editionArtworkFilename),
    new File([mainImage], mainImageFilename),
  ]);
  const folderUri = `https://${cid}.ipfs.nftstorage.link`;

  return {
    mainImage: `${folderUri}/${mainImageFilename}`,
    galleryImages: galleryImages.map((_, i) => `${folderUri}/${galleryImageFilename(i)}`),
    editionImage: `${folderUri}/${editionArtworkFilename}`,
  };
};

export const generateGalleryImage = async (staticPart: NounPartType, staticPartBitmap: ImageBitmap) => {
  const imageCanvas = document.createElement("canvas");
  imageCanvas.width = PROPOSAL_GALLERY_IMAGE_SIZE;
  imageCanvas.height = PROPOSAL_GALLERY_IMAGE_SIZE;

  for (const currentPart of nounParts) {
    if (currentPart === staticPart) {
      drawCanvas(staticPartBitmap, imageCanvas);
      continue;
    }

    await drawPartFromSeed(currentPart, getRandomSeed(currentPart), imageCanvas);
  }

  return new Promise<Blob>((resolve, reject) => {
    imageCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject();
      }
    }, "image/png");
  });
};

export const generateMainImage = async (staticPart: NounPartType, staticPartBitmap: ImageBitmap) => {
  const imageCanvas = document.createElement("canvas");
  imageCanvas.width = PROPOSAL_MAIN_IMAGE_SIZE;
  imageCanvas.height = PROPOSAL_MAIN_IMAGE_SIZE;

  for (const currentPart of nounParts) {
    switch (currentPart) {
      case staticPart:
        await drawCanvas(staticPartBitmap, imageCanvas);
        continue;

      case "glasses":
        await drawPartFromSeed("glasses", 5, imageCanvas); //blue noggles
        continue;

      case "accessory":
        await drawPartFromSeed("accessory", 70, imageCanvas); //none
        continue;

      case "head":
      case "body":
      case "background":
      default:
        await drawPartFromSeed(currentPart, 0, imageCanvas);
    }
  }

  return new Promise<Blob>((resolve, reject) => {
    imageCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject();
      }
    }, "image/png");
  });
};

export const galleryImageFilename = (i: number) => `${i + 1}.png`;
