import { PngDataUri } from "@/types/image";
import Sharp from "sharp";

export const resizePng = async (
  dataUri: PngDataUri,
  width: number,
  height: number
): Promise<PngDataUri> => {
  const buffer = Buffer.from(
    dataUri.replace("data:image/png;base64,", ""),
    "base64"
  );

  const pixelArray = new Uint8ClampedArray(buffer);

  return (await Sharp(pixelArray)
    .resize(width, height, { kernel: "nearest" })
    .toFormat("png")
    .toBuffer()
    .then(
      (data) => `data:image/png;base64,${data.toString("base64")}`
    )) as PngDataUri;
};
