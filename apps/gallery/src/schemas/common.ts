import { z } from "zod";

export const sortFieldSchema = z.enum(["name", "likes", "createdAt"]);
export const sortDirectionSchema = z.enum(["asc", "desc"]);
export const addressSchema = z.string().startsWith("0x").length(42);
export const pngDataUrlSchema = z.string().startsWith("data:image/png;base64,");
export const usernameSchema = z
  .string()
  .min(1)
  .max(15)
  .regex(
    /^[a-zA-Z0-9-]+$/,
    "Your username can only include letters, numbers and dashes"
  );
