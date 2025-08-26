import { TRAITS_PAGE_SIZE } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { TraitsQuery, traitsQuerySchema } from "@/schemas/traitsQuery";
import { getDatabase } from "@/utils/database/db";
import { createUserInfoField } from "@/utils/database/createUserInfoField";
import Session from "@/utils/siwe/session";
import { SortDirection } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await Session.fromRequest(req);

  const { searchParams } = new URL(req.url);

  const sortBy = searchParams.get("sortBy") ?? undefined;
  const search = searchParams.get("search") ?? undefined;
  const includeTypes = searchParams.getAll("includeType");
  const creator = searchParams.get("creator") ?? undefined;
  const likedBy = searchParams.get("likedBy") ?? undefined;
  const page = searchParams.get("page") ?? undefined;

  const schemaValidation = traitsQuerySchema.safeParse({
    sortBy,
    search,
    includeTypes:
      includeTypes.length === 0
        ? ["heads", "glasses", "accessories", "bodies", "nouns"]
        : includeTypes,
    creator,
    likedBy,
    page,
  });

  if (!schemaValidation.success) {
    return NextResponse.json(schemaValidation.error.issues, { status: 400 });
  }

  const query = schemaValidation.data;

  const { sortField, sortDirection } = getSortCriteria(query.sortBy);

  const database = await getDatabase();

  // First, get total count and paginated results separately for efficiency
  const [countResult, traitsResult] = await Promise.all([
    // Count query - no lookup needed, very fast
    database.collection<TraitSchema>("nfts").aggregate([
      {
        $match: {
          ...(query.search
            ? { name: { $regex: query.search, $options: "i" } }
            : {}),
          ...(query.creator ? { address: query.creator.toLowerCase() } : {}),
          removed: { $ne: true },

          $expr: {
            $and: [
              { $in: ["$type", query.includeTypes] },
              ...(query.likedBy
                ? [{ $in: [query.likedBy.toLowerCase(), "$likedBy"] }]
                : []),
            ],
          },
        },
      },
      { $count: "total" },
    ]).toArray(),

    // Paginated results query - sort first, limit, then lookup only for current page
    database.collection<TraitSchema>("nfts").aggregate([
      {
        $match: {
          ...(query.search
            ? { name: { $regex: query.search, $options: "i" } }
            : {}),
          ...(query.creator ? { address: query.creator.toLowerCase() } : {}),
          removed: { $ne: true },

          $expr: {
            $and: [
              { $in: ["$type", query.includeTypes] },
              ...(query.likedBy
                ? [{ $in: [query.likedBy.toLowerCase(), "$likedBy"] }]
                : []),
            ],
          },
        },
      },
      {
        $addFields: {
          likesCount: {
            $cond: {
              if: { $isArray: "$likedBy" },
              then: { $size: "$likedBy" },
              else: 0,
            },
          },
        },
      },
      {
        $sort: {
          [sortField]: sortDirection,
        },
      },
      {
        $skip: TRAITS_PAGE_SIZE * (query.page - 1),
      },
      {
        $limit: TRAITS_PAGE_SIZE,
      },
      // Only NOW do the lookup for the current page items
      {
        $lookup: {
          from: "users",
          localField: "address",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          ...createUserInfoField(),
          id: {
            $toString: "$_id",
          },
          ...(session.address
            ? { liked: { $in: [session.address.toLowerCase(), "$likedBy"] } }
            : {}),
        },
      },
      { $project: { likedBy: 0, likers: 0, _id: 0 } },
    ]).toArray()
  ]);

  const totalTraits = countResult[0]?.total || 0;
  const totalPages = Math.ceil(totalTraits / TRAITS_PAGE_SIZE);

  return NextResponse.json({
    traits: traitsResult,
    pageNumber: query.page,
    traitCount: totalTraits,
    totalPages,
  });
}

const getSortCriteria = (
  sortBy: TraitsQuery["sortBy"]
): { sortField: string; sortDirection: SortDirection } => {
  switch (sortBy) {
    case "mostLiked":
      return { sortField: "likesCount", sortDirection: -1 };
    case "oldest":
      return { sortField: "creationDate", sortDirection: 1 };
    case "newest":
    default:
      return { sortField: "creationDate", sortDirection: -1 };
  }
};
