export { colormap } from "./artwork/colormap.js";
export { decodeTrait } from "./artwork/decodeTrait.js";
export { encodeTrait } from "./artwork/encodeTrait.js";
export { fetchMainnetArtwork } from "./artwork/onchain/fetchMainnetArtwork.js";
export {
  ColorIndex,
  DecodedTrait,
  EncodedTrait,
  HexColor,
  IndexedColorTrait,
  RawTrait,
  type OnchainArtwork,
  type Palette,
} from "./types/artwork.js";

export {
  EMPTY_ENCODED_TRAIT,
  IMAGE_TRAIT_TYPES,
  TRAIT_TYPES,
} from "./constants/traits.js";
export { type TraitCategory, type TraitType } from "./types/traits.js";

export { isTraitType } from "./utils/traits/isTraitType.js";
