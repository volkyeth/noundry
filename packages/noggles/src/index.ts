export { colormap } from "./artwork/colormap.js";
export { decodeTrait } from "./artwork/decodeTrait.js";
export { encodeTrait } from "./artwork/encodeTrait.js";
export { toImageData } from "./artwork/toImageData.js";
export { fetchOnchainNounsArtData } from "./nouns/onchain/fetchOnchainNounsArtData.js";
export { fetchOnchainNounTraits } from "./nouns/onchain/fetchOnchainNounTraits.js";
export { nounsTraitNames } from "./nouns/traitNames.js";
export {
  type ColorIndex,
  type DecodedTrait,
  type EncodedTrait,
  type HexColor,
  type IndexedColorTrait,
  type NounsArtData as OnchainArtwork,
  type Palette,
  type RawTrait
} from "./types/artwork.js";

export {
  type TraitNames
} from "./types/traits.js";

export {
  EMPTY_ENCODED_TRAIT,
  IMAGE_TRAIT_TYPES,
  TRAIT_TYPES
} from "./constants/traits.js";

export { TRANSPARENT_HEX, TRANSPARENT_INDEX } from "./constants/artwork.js";
export { type NounTraits } from "./types/artwork.js";
export { type NounSeed } from "./types/seed.js";
export { type TraitCategory, type TraitType } from "./types/traits.js";

export { isTraitType } from "./utils/traits/isTraitType.js";
