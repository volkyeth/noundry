import { TRAITS_PAGE_SIZE } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { TraitsQuery, traitsQuerySchema } from "@/schemas/traitsQuery";
import { database } from "@/utils/database/db";
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
        ? ["heads", "glasses", "accessories", "bodies"]
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

  const cursor = database.collection<TraitSchema>("nfts").aggregate([
    {
      $match: {
        ...(query.search
          ? { name: { $regex: query.search, $options: "i" } }
          : {}),
        ...(query.creator ? { address: query.creator } : {}),

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
        id: {
          $toString: "$_id",
        },
      },
    },
    {
      $sort: {
        [sortField]: sortDirection,
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
          $slice: [
            "$allTraits",
            TRAITS_PAGE_SIZE * (query.page - 1),
            TRAITS_PAGE_SIZE,
          ],
        },
        pageNumber: query.page,
        traitCount: { $size: "$allTraits" },
        totalPages: {
          $ceil: { $divide: [{ $size: "$allTraits" }, TRAITS_PAGE_SIZE] },
        },
      },
    },
    { $project: { allTraits: 0, _id: 0 } },
  ]);

  return NextResponse.json(
    (await cursor.next()) ?? {
      traits: [],
      pageNumber: query.page,
      traitCount: 0,
      totalPages: 0,
    }
  );
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
