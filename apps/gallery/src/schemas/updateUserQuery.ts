import { string, z } from "zod";
import { usernameSchema } from "./common";

export const updateUserQuerySchema = z.object({
  twitter: z.optional(string()),
  farcaster: z.optional(string()),
  userName: z.optional(usernameSchema),
  about: z.optional(string()),
  profilePic: z.optional(string()),
});

export type UpdateUserQuery = z.infer<typeof updateUserQuerySchema>;
