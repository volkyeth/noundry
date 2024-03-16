import { IMAGE_TRAIT_TYPES, TraitType } from "noggles";
import { z } from "zod";

export const traitNameSchema = z.string().min(1).max(17);

export const imageTraitTypeSchema = z.enum([...IMAGE_TRAIT_TYPES] as [
  string,
  ...string[],
]);
