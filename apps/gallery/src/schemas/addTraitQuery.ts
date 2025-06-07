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
  // Optional seed object containing all trait values
  seed: z.object({
    accessory: z.number().optional(),
    background: z.number().optional(),
    body: z.number().optional(),
    glasses: z.number().optional(),
    head: z.number().optional(),
  }).optional(),
  // Optional remixedFrom ObjectId reference
  remixedFrom: z.string().optional(),
});

export type AddTraitQuery = z.infer<typeof addTraitQuerySchema>;
