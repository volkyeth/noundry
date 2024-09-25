"use server";

import { ProposalImagesUris } from "@/app/propose/generateProposalContent";
import { File, NFTStorage } from "nft.storage";

export const uploadPropImages = async (
  images: ProposalImagesUris
): Promise<ProposalImagesUris> => {
  if (!process.env.NFT_STORAGE_API_KEY)
    throw new Error("NFT_STORAGE_API_KEY is not set");

  const nftStorageClient = new NFTStorage({
    token: process.env.NFT_STORAGE_API_KEY,
  });

  const ipfsImagesCid = await nftStorageClient.storeDirectory([
    await toFile(images.circleCropLg, circleCropLgFilename),
    // await toFile(images.circleCropMd, circleCropMdFilename),
    // await toFile(images.circleCropSm, circleCropSmFilename),
    await toFile(images.standalone, standaloneFilename),
    await toFile(images.palette, paletteFilename),
    await toFile(images.previewNoun, previewNounFilename),
    // ...(await Promise.all(
    //   images.galleryImages.map((uri, i) => toFile(uri, galleryImageFilename(i)))
    // )),
  ]);

  const folderUri = `https://${ipfsImagesCid}.ipfs.nftstorage.link`;

  return {
    circleCropLg: `${folderUri}/${circleCropLgFilename}`,
    // circleCropMd: `${folderUri}/${circleCropMdFilename}`,
    // circleCropSm: `${folderUri}/${circleCropSmFilename}`,
    standalone: `${folderUri}/${standaloneFilename}`,
    palette: `${folderUri}/${paletteFilename}`,
    previewNoun: `${folderUri}/${previewNounFilename}`,
    // galleryImages: images.galleryImages.map(
    //   (_, i) => `${folderUri}/${galleryImageFilename(i)}`
    // ),
  };
};

const circleCropLgFilename = "circle-crop-lg.png";
const circleCropMdFilename = "circle-crop-md.png";
const circleCropSmFilename = "circle-crop-sm.png";
const standaloneFilename = "standalone.png";
const paletteFilename = "palette.png";
const previewNounFilename = "preview-noun.png";

const galleryImageFilename = (i: number) => `preview-${i + 1}.png`;

const toFile = async (uri: string, filename: string) => {
  const blob = await fetch(uri).then((res) => res.blob());
  return new File([blob], filename);
};
