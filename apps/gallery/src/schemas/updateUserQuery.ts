import { string, z } from "zod";
import { pngDataUrlSchema, usernameSchema } from "./common";

export const updateUserQuerySchema = z.object({
  twitter: z.optional(string()),
  farcaster: z.optional(string()),
  userName: usernameSchema,
  about: z.optional(string()),
  profilePic: z.optional(pngDataUrlSchema),
});

export type UpdateUserQuery = z.infer<typeof updateUserQuerySchema>;
