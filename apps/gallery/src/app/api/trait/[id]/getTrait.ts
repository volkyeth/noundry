import { TraitSchema } from "@/db/schema/TraitSchema";
import { Trait } from "@/types/trait";
import { database } from "@/utils/database/db";
import { ObjectId } from "mongodb";

export const getTrait = async (
  id: string,
  options?: { requester?: `0x${string}` }
) => {
  const cursor = database.collection<TraitSchema>("nfts").aggregate([
    {
      $match: {
        _id: new ObjectId(id),
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
