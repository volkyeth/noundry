export { colormap } from "./artwork/colormap.js";
export { decodeTrait } from "./artwork/decodeTrait.js";
export { encodeTrait } from "./artwork/encodeTrait.js";
export { fetchNounTraits } from "./artwork/onchain/fetchNounTraits.js";
export { fetchNounsArtwork } from "./artwork/onchain/fetchNounsArtwork.js";
export {
  type ColorIndex,
  type DecodedTrait,
  type EncodedTrait,
  type HexColor,
  type IndexedColorTrait,
  type OnchainArtwork,
  type Palette,
  type RawTrait,
} from "./types/artwork.js";

export {
  EMPTY_ENCODED_TRAIT,
  IMAGE_TRAIT_TYPES,
  TRAIT_TYPES,
} from "./constants/traits.js";
export { type NounTraits } from "./types/artwork.js";
export { type NounSeed } from "./types/seed.js";
export { type TraitCategory, type TraitType } from "./types/traits.js";

export { isTraitType } from "./utils/traits/isTraitType.js";
