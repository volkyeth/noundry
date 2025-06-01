import { z } from "zod";
import { addressSchema, sortBySchema } from "./common";

export const traitsQuerySchema = z
  .object({
    sortBy: z.optional(sortBySchema).default("newest"),
    search: z.optional(z.string()),
    includeTypes: z
      .optional(z.array(z.enum(["heads", "glasses", "accessories", "bodies", "nouns"])))
      .default(["heads", "glasses", "accessories", "bodies", "nouns"]),

    creator: z.optional(addressSchema),
    likedBy: z.optional(addressSchema),
    page: z.optional(z.coerce.number().min(1)).default(1),
  })
  .refine(({ creator, likedBy }) => !(creator && likedBy), {
    message: "Cannot filter by both creator and likedBy",
  });

export type TraitsQuery = z.infer<typeof traitsQuerySchema>;

export const toQueryString = ({
  page,
  creator,
  likedBy,
  includeTypes,
  sortBy,
  search,
}: Partial<TraitsQuery>) => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.set("page", page.toString());
  if (creator) searchParams.set("creator", creator);

  if (likedBy) searchParams.set("likedBy", likedBy);

  if (includeTypes) {
    includeTypes.forEach((type) => {
      searchParams.append("includeType", type);
    });
  }

  if (sortBy) searchParams.set("sortBy", sortBy);

  if (search) searchParams.set("search", search);

  return searchParams.toString();
};
