import { EncodedTrait, HexColor } from "noggles";

export type NounSeed = {
  glasses: number;
  head: number;
  accessory: number;
  body: number;
  background: number;
};

export type NounTraits = {
  glasses: EncodedTrait | ImageBitmap;
  head: EncodedTrait | ImageBitmap;
  accessory: EncodedTrait | ImageBitmap;
  body: EncodedTrait | ImageBitmap;
  background: HexColor;
};
