import { EncodedTrait, HexColor } from "noggles";
import { PngDataUri } from "./image";

export type NounTraits = {
  glasses: EncodedTrait | ImageBitmap | PngDataUri;
  head: EncodedTrait | ImageBitmap | PngDataUri;
  accessory: EncodedTrait | ImageBitmap | PngDataUri;
  body: EncodedTrait | ImageBitmap | PngDataUri;
  background: HexColor;
};
