"use server";

import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";
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
      $lookup: {
        from: "users",
        localField: "address",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $addFields: {
        userInfo: {
          $let: {
            vars: { user: { $arrayElemAt: ["$userInfo", 0] } },
            in: {
              address: "$address",
              userName: {
                $cond: {
                  if: {
                    $and: [
                      { $ne: ["$$user.userName", null] },
                      { $ne: ["$$user.userName", ""] }
                    ]
                  },
                  then: { $toLower: "$$user.userName" },
                  else: {
                    $cond: {
                      if: {
                        $and: [
                          { $ne: ["$$user.ensName", null] },
                          { $ne: ["$$user.ensName", ""] }
                        ]
                      },
                      then: "$$user.ensName",
                      else: {
                        $concat: [
                          { $substr: ["$address", 0, 6] },
                          "...",
                          { $substr: ["$address", -4, 4] },
                        ],
                      },
                    },
                  },
                },
              },
              profilePic: {
                $ifNull: [
                  "$$user.profilePic",
                  {
                    $ifNull: [
                      "$$user.ensAvatar",
                      DEFAULT_PROFILE_PICTURE,
                    ],
                  },
                ],
              },
              about: "$$user.about",
              twitter: "$$user.twitter",
              farcaster: "$$user.farcaster",
            },
          },
        },
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
