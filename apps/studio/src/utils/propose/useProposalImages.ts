import loadingNounSmall from "@/assets/loading-noun-smaller.gif";
import loadingNoun from "@/assets/loading-noun.gif";
import { useEffect, useState } from "react";
import {
  AMOUNT_PROPOSAL_GALLERY_IMAGES,
  PROPOSAL_GALLERY_IMAGE_SIZE,
  PROPOSAL_GALLERY_MARGIN_SIZE,
  PROPOSAL_MAIN_IMAGE_SIZE,
} from "../../constants/proposal";
import { NounPartType } from "../../types/noun";
import { drawCanvas } from "../canvas/drawCanvas";
import { nounParts } from "../constants";
import { getNftStorageClient } from "../ipfs";
import { amountOfParts, drawPartFromSeed, getRandomSeed } from "../nounAssets";
import { generateDroposalGif } from "./generateDroposalGif";

export interface ProposalImages {
  galleryImages: string[];
  editionImage: string;
  mainImage: string;
}

export const useProposalImages = (
  partType: NounPartType,
  partBitmap: ImageBitmap
): ProposalImages & { isUploading: boolean } => {
  const [galleryImages, setGalleryImages] = useState<string[]>(
    new Array(AMOUNT_PROPOSAL_GALLERY_IMAGES).fill(loadingNounSmall)
  );
  const [editionImage, setEditionImage] = useState<string>(loadingNoun);
  const [mainImage, setMainImage] = useState<string>(loadingNoun);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    setIsUploading(true);
    const storageClient = getNftStorageClient();
    Promise.all([
      Promise.all(
        new Array(AMOUNT_PROPOSAL_GALLERY_IMAGES)
          .fill(null)
          .map((_, i) => generateGalleryImage(partType, partBitmap, i))
      )
        .then((galleryImages) =>
          storageClient.storeDirectory([
            ...galleryImages.map(
              (blob, i) => new File([blob], galleryImageFilename(i))
            ),
          ])
        )
        .then((cid) => `https://${cid}.ipfs.nftstorage.link`)
        .then((folderUri) =>
          setGalleryImages(
            new Array(AMOUNT_PROPOSAL_GALLERY_IMAGES)
              .fill(null)
              .map((_, i) => `${folderUri}/${galleryImageFilename(i)}`)
          )
        ),
      generateDroposalGif(partType, partBitmap)
        .then((blob) => storageClient.storeBlob(blob))
        .then((cid) => `https://${cid}.ipfs.nftstorage.link`)
        .then((uri) => setEditionImage(uri)),
      generateMainImage(partType, partBitmap)
        .then((blob) => storageClient.storeBlob(blob))
        .then((cid) => `https://${cid}.ipfs.nftstorage.link`)
        .then((uri) => setMainImage(uri)),
    ]).then(() => setIsUploading(false));
  }, [partType, partBitmap]);

  return {
    isUploading,
    mainImage,
    galleryImages,
    editionImage,
  };
};

export const generateGalleryImage = async (
  staticPart: NounPartType,
  staticPartBitmap: ImageBitmap,
  index: number = 0
) => {
  const imageCanvas = document.createElement("canvas");
  imageCanvas.width = PROPOSAL_GALLERY_IMAGE_SIZE;
  imageCanvas.height = PROPOSAL_GALLERY_IMAGE_SIZE;

  for (const currentPart of nounParts) {
    if (currentPart === staticPart) {
      drawCanvas(staticPartBitmap, imageCanvas);
      continue;
    }

    if (currentPart === "head") {
      await drawPartFromSeed(
        currentPart,
        getRandomSeed(currentPart),
        imageCanvas
      );
      continue;
    }

    if (currentPart === "accessory") {
      await drawPartFromSeed(
        currentPart,
        index < amountOfParts("body") ? 70 : getRandomSeed(currentPart), //use "none" accessory on the first appearance of each body color
        imageCanvas
      );
      continue;
    }

    await drawPartFromSeed(
      currentPart,
      index % amountOfParts(currentPart),
      imageCanvas
    );
  }

  const marginCanvas = document.createElement("canvas");
  marginCanvas.width =
    PROPOSAL_GALLERY_IMAGE_SIZE + 2 * PROPOSAL_GALLERY_MARGIN_SIZE;
  marginCanvas.height =
    PROPOSAL_GALLERY_IMAGE_SIZE + 2 * PROPOSAL_GALLERY_MARGIN_SIZE;

  drawCanvas(
    imageCanvas,
    marginCanvas,
    PROPOSAL_GALLERY_MARGIN_SIZE,
    PROPOSAL_GALLERY_MARGIN_SIZE
  );

  return new Promise<Blob>((resolve, reject) => {
    marginCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject();
      }
    }, "image/png");
  });
};

export const generateMainImage = async (
  staticPart: NounPartType,
  staticPartBitmap: ImageBitmap
) => {
  const imageCanvas = document.createElement("canvas");
  imageCanvas.width = PROPOSAL_MAIN_IMAGE_SIZE;
  imageCanvas.height = PROPOSAL_MAIN_IMAGE_SIZE;

  for (const currentPart of nounParts) {
    console.log(currentPart);
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

      case "body":
        await drawPartFromSeed("body", 13, imageCanvas); //black
        continue;

      case "background":
        await drawPartFromSeed("background", 0, imageCanvas);
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
