import { EncodedTrait, HexColor } from "noggles";

export type NounTraits = {
  glasses: EncodedTrait | ImageBitmap;
  head: EncodedTrait | ImageBitmap;
  accessory: EncodedTrait | ImageBitmap;
  body: EncodedTrait | ImageBitmap;
  background: HexColor;
};
