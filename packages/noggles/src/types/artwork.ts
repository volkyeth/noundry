export type ColorIndex = number;

export type EncodedTrait = `0x${string}`;

export type HexColor = `#${string}`;

export type Palette = HexColor[];

export type DecodedTrait = {
  paletteIndex: number;
  colorIndexes: ColorIndex[];
  width: number;
  height: number;
};

export type IndexedColorTrait = {
  colorIndexes: ColorIndex[];
  width: number;
  height: number;
};

export type RawTrait = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

export type BoundedColorIndexes = {
  bounds: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  boundedColorIndexes: ColorIndex[];
};

export type EncodedCompressedTraits = [
  encodedCompressedArtwork: `0x${string}`,
  originalLength: bigint,
  itemCount: number,
];

export type OnchainArtwork = {
  glasses: EncodedTrait[];
  heads: EncodedTrait[];
  accessories: EncodedTrait[];
  bodies: EncodedTrait[];
  backgrounds: HexColor[];
  palettes: Palette[];
};

export type NounTraits = {
  glasses: EncodedTrait;
  head: EncodedTrait;
  accessory: EncodedTrait;
  body: EncodedTrait;
  background: HexColor;
};
