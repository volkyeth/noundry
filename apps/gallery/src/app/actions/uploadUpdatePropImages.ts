"use server";

import { UpdateProposalImagesUris } from "@/app/propose-update/generateUpdateProposalContent";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

// Initialize S3 client for B2
const s3Client = new S3Client({
    endpoint: `https://${process.env.S3_ENDPOINT}`,
    region: process.env.S3_REGION ?? "us-west-004",
    credentials: {
        accessKeyId: process.env.S3_KEY_ID ?? "",
        secretAccessKey: process.env.S3_APP_KEY ?? "",
    },
});

export const uploadUpdatePropImages = async (
    images: UpdateProposalImagesUris
): Promise<UpdateProposalImagesUris> => {
    if (!process.env.S3_BUCKET_NAME) throw new Error("S3_BUCKET_NAME is not set");
    if (!process.env.S3_KEY_ID) throw new Error("S3_KEY_ID is not set");
    if (!process.env.S3_APP_KEY) throw new Error("S3_APP_KEY is not set");

    const folderName = nanoid(9);

    await Promise.all([
        uploadFile(images.oldStandalone, `${folderName}/${oldStandaloneFilename}`),
        uploadFile(images.newStandalone, `${folderName}/${newStandaloneFilename}`),
        uploadFile(images.oldPalette, `${folderName}/${oldPaletteFilename}`),
        uploadFile(images.newPalette, `${folderName}/${newPaletteFilename}`),
        ...images.galleryImages.map((uri, i) =>
            uploadFile(uri, `${folderName}/${galleryImageFilename(i)}`)
        ),
    ]);

    const baseUrl = `${process.env.PROP_IMAGES_DOMAIN}/${folderName}`;

    return {
        oldStandalone: `${baseUrl}/${oldStandaloneFilename}`,
        newStandalone: `${baseUrl}/${newStandaloneFilename}`,
        oldPalette: `${baseUrl}/${oldPaletteFilename}`,
        newPalette: `${baseUrl}/${newPaletteFilename}`,
        galleryImages: images.galleryImages.map(
            (_, i) => `${baseUrl}/${galleryImageFilename(i)}`
        ),
    };
};

const oldStandaloneFilename = "old-standalone.png";
const newStandaloneFilename = "new-standalone.png";
const oldPaletteFilename = "old-palette.png";
const newPaletteFilename = "new-palette.png";

const galleryImageFilename = (i: number) => `${i + 1}.png`;

const uploadFile = async (uri: string, key: string) => {
    // Convert data URI to buffer
    const base64Data = uri.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: 'image/png',
        ACL: 'public-read',
    });

    await s3Client.send(command);
}; 