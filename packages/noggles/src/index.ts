export { colormap } from "./artwork/colormap.js";
export { decodeTrait } from "./artwork/decodeTrait.js";
export { encodeTrait } from "./artwork/encodeTrait.js";
export { toImageData } from "./artwork/toImageData.js";
export { fetchLatestLilNounId } from "./lil-nouns/fetchLatestLilNounId.js";
export { fetchLilNounSeed } from "./lil-nouns/fetchLilNounSeed.js";
export { fetchOnchainLilNounsArtData } from "./lil-nouns/fetchOnchainLilNounsArtData.js";
export { fetchOnchainLilNounTraits } from "./lil-nouns/fetchOnchainLilNounTraits.js";
export { lilNounsTraitNames } from "./lil-nouns/traitNames.js";
export { fetchLatestNounId } from "./nouns/fetchLatestNounId.js";
export { fetchNounSeed } from "./nouns/fetchNounSeed.js";
export { fetchOnchainNounsArtData } from "./nouns/fetchOnchainNounsArtData.js";
export { fetchOnchainNounTraits } from "./nouns/fetchOnchainNounTraits.js";
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
