import { TraitSchema } from "@/db/schema/TraitSchema";
import { TraitsQuery, traitsQuerySchema } from "@/queries/traitsQuery";
import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await Session.fromRequest(req);

  const { searchParams } = new URL(req.url);

  const sortBy = searchParams.get("sortBy") ?? undefined;
  const direction = searchParams.get("direction") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const includeTypes = searchParams.getAll("includeType");
  const account = searchParams.get("account") ?? undefined;
  const page = searchParams.get("page") ?? undefined;

  const PAGE_SIZE = 16;

  const schemaValidation = traitsQuerySchema.safeParse({
    sortBy,
    direction,
    search,
    includeTypes:
      includeTypes.length === 0
        ? ["heads", "glasses", "accessories", "bodies"]
        : includeTypes,
    account,
    page,
  });

  if (!schemaValidation.success) {
    return NextResponse.json(schemaValidation.error.issues, { status: 400 });
  }

  const query = schemaValidation.data;

  const sortField = getSortField(query.sortBy);

  const cursor = database.collection<TraitSchema>("nfts").aggregate(
    [
      {
        $match: {
          ...(query.account ? { address: query.account } : {}),
          $expr: { $in: ["$type", query.includeTypes] },
        },
      },
      { $sort: { [sortField]: query.direction === "asc" ? 1 : -1 } },
      {
        $addFields: {
          likesCount: {
            $cond: {
              if: { $isArray: "$likedBy" },
              then: { $size: "$likedBy" },
              else: 0,
            },
          },
          id: {
            $toString: "$_id",
          },
        },
      },
      ...(session.address
        ? [
            {
              $addFields: {
                liked: { $in: [session.address.toLowerCase(), "$likedBy"] },
              },
            },
          ]
        : []),
      { $project: { likedBy: 0, likers: 0, _id: 0 } },
      {
        $group: {
          _id: null,
          allTraits: { $push: "$$ROOT" },
        },
      },
      {
        $addFields: {
          traits: {
            $slice: ["$allTraits", PAGE_SIZE * (query.page - 1), PAGE_SIZE],
          },
          pageNumber: query.page,
          traitCount: { $size: "$allTraits" },
          totalPages: {
            $ceil: { $divide: [{ $size: "$allTraits" }, PAGE_SIZE] },
          },
        },
      },
      { $project: { allTraits: 0, _id: 0 } },
    ],
    { collation: { locale: "en", strength: 2 } }
  );

  return NextResponse.json(await cursor.next());
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
