"use server";

import { TraitSchema } from "@/db/schema/TraitSchema";
import { Trait } from "@/types/trait";
import { getDatabase } from "@/utils/database/db";
import { ObjectId } from "mongodb";

export const getTrait = async (
  id: string,
  options?: { requester?: `0x${string}` }
) => {
  const database = await getDatabase();
  const cursor = database.collection<TraitSchema>("nfts").aggregate([
    {
      $match: {
        _id: new ObjectId(id),
        removed: { $ne: true },
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
        remixedFrom: {
          $cond: {
            if: { $ne: ["$remixedFrom", null] },
            then: { $toString: "$remixedFrom" },
            else: undefined,
          },
        },
      },
    },
    ...(options?.requester
      ? [
          {
            $addFields: {
              liked: { $in: [options.requester.toLowerCase(), "$likedBy"] },
            },
          },
        ]
      : []),
    { $project: { likedBy: 0, likers: 0, _id: false } },
  ]);

  return (await cursor.next()) as Trait | null;
};
