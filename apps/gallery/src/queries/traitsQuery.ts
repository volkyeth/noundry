import { z } from "zod";
import { addressSchema, sortDirectionSchema, sortFieldSchema } from "./schemas";

export const traitsQuerySchema = z.object({
  sortBy: z.optional(sortFieldSchema).default("createdAt"),
  direction: z.optional(sortDirectionSchema).default("desc"),
  search: z.optional(z.string()),
  includeTypes: z
    .optional(z.array(z.enum(["heads", "glasses", "accessories", "bodies"])))
    .default(["heads", "glasses", "accessories", "bodies"]),
  account: z.optional(addressSchema),
  page: z.optional(z.coerce.number().min(1)).default(1),
});

export type TraitsQuery = z.infer<typeof traitsQuerySchema>;

export const toQuerySting = ({
  page,
  includeTypes,
  ...query
}: Partial<TraitsQuery>) => {
  const searchParams = new URLSearchParams(query);

  if (page) searchParams.set("page", page.toString());

  if (includeTypes) {
    includeTypes.forEach((type) => {
      searchParams.append("includeType", type);
    });
  }

  return searchParams.toString();
};
