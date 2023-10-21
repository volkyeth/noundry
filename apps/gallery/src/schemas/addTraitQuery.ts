import { z } from "zod";
import { pngDataUrlSchema } from "./common";
import { imageTraitTypeSchema, traitNameSchema } from "./trait";

export const addTraitQuerySchema = z.object({
  name: traitNameSchema,
  traitImage: pngDataUrlSchema,
  previewImage: pngDataUrlSchema,
  traitType: imageTraitTypeSchema,
});

export type AddTraitQuery = z.infer<typeof addTraitQuerySchema>;
