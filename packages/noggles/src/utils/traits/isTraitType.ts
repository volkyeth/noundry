import { TRAIT_TYPES, TraitType } from "../../index.js";

export const isTraitType = (traitType: string): traitType is TraitType =>
  TRAIT_TYPES.includes(traitType as any);
