import { z } from "zod";

export const sortBySchema = z.enum(["mostLiked", "newest", "oldest"]);
export const addressSchema = z.string().startsWith("0x").length(42).transform((addr: string) => addr.toLowerCase());
export const pngDataUrlSchema = z.string().startsWith("data:image/png;base64,");
export const usernameSchema = z
  .string()
  .min(1)
  .max(15)
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Your username can only include letters, numbers and dashes"
  );
