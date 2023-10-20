import { z } from "zod";

export const sortFieldSchema = z.enum(["name", "likes", "createdAt"]);
export const sortDirectionSchema = z.enum(["asc", "desc"]);
export const addressSchema = z.string().startsWith("0x").length(42);
export const pngDataUrlSchema = z.string().startsWith("data:image/png;base64,");
