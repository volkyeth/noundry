import { z } from "zod";
import { pngDataUrlSchema } from "./common";
import { traitNameSchema } from "./trait";

// Create a schema for submission types that includes both trait types and "noun"
const submissionTypeSchema = z.enum(["glasses", "head", "accessory", "body", "noun"]);

export const addTraitQuerySchema = z.object({
  name: traitNameSchema,
  traitImage: pngDataUrlSchema,
  previewImage: pngDataUrlSchema,
  traitType: submissionTypeSchema,
});

export type AddTraitQuery = z.infer<typeof addTraitQuerySchema>;
