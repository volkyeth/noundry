import { TraitSchema } from "@/db/schema/TraitSchema";
import { TraitsQuery, traitsQuerySchema } from "@/queries/traitsQuery";
import { database } from "@/utils/database/db";
import { imageTraitTypes } from "@/utils/nouns/artwork";
import Session from "@/utils/siwe/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await Session.fromRequest(req);

  const { searchParams } = new URL(req.url);

  const sortBy = searchParams.get("sortBy") ?? undefined;
  const direction = searchParams.get("direction") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const includeTypes = searchParams.getAll("includeType");
  const author = searchParams.get("author") ?? undefined;
  const page = searchParams.get("page") ?? undefined;

  const PAGE_SIZE = 16;

  const schemaValidation = traitsQuerySchema.safeParse({
    sortBy,
    direction,
    search,
    includeTypes: includeTypes.length === 0 ? imageTraitTypes : includeTypes,
    author,
    page,
  });

  if (!schemaValidation.success) {
    return NextResponse.json(schemaValidation.error.issues, { status: 400 });
  }

  const query = schemaValidation.data;

  const sortField = getSortField(query.sortBy);

  const cursor = database
    .collection<TraitSchema>("nfts")
    .aggregate(
      [
        {
          $match: {
            // address: query.author,
            $expr: { $in: ["$type", query.includeTypes] },
          },
        },
        ...(session.address
          ? [
              {
                $addFields: {
                  likesCount: {
                    $cond: {
                      if: { $isArray: "$likedBy" },
                      then: { $size: "$likedBy" },
                      else: 0,
                    },
                  },
                  liked: { $in: [session.address.toLowerCase(), "$likedBy"] },
                },
              },
            ]
          : []),
        { $project: { likedBy: 0, likers: 0 } },
      ],
      { collation: { locale: "en", strength: 2 } }
    )
    .sort({ [sortField]: query.direction === "asc" ? 1 : -1 })
    .skip(PAGE_SIZE * query.page - 1)
    .limit(PAGE_SIZE);

  return NextResponse.json(await cursor.toArray());
}

const getSortField = (sortBy: TraitsQuery["sortBy"]) => {
  switch (sortBy) {
    case "name":
      return "name";
    case "likes":
      return "likesCount";
    case "createdAt":
      return "creationDate";
  }
};
