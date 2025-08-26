"use server";

import { DEFAULT_PROFILE_PICTURE } from "@/constants/config";
import { TraitSchema } from "@/db/schema/TraitSchema";
import { UserStats } from "@/types/user";
import { getDatabase } from "@/utils/database/db";

export const getArtistStats = async () => {
  const database = await getDatabase();
  const cursor = database.collection<TraitSchema>("nfts").aggregate([
    {
      $match: {
        removed: { $ne: true },
      },
    },
    {
      $project: {
        _id: false,
        type: true,
        address: true,
      },
    },
    {
      $group: {
        _id: "$address",
        traits: { $sum: { $cond: [{ $ne: ["$type", "nouns"] }, 1, 0] } },
        heads: { $sum: { $cond: [{ $eq: ["$type", "heads"] }, 1, 0] } },
        accessories: {
          $sum: { $cond: [{ $eq: ["$type", "accessories"] }, 1, 0] },
        },
        glasses: {
          $sum: { $cond: [{ $eq: ["$type", "glasses"] }, 1, 0] },
        },
        bodies: {
          $sum: { $cond: [{ $eq: ["$type", "bodies"] }, 1, 0] },
        },
        nouns: {
          $sum: { $cond: [{ $eq: ["$type", "nouns"] }, 1, 0] },
        },
      },
    },
    { $match: { traits: { $gt: 0 } } },
    { $sort: { traits: -1, _id: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        address: {
          $toString: "$_id",
        },
        userInfo: {
          $let: {
            vars: { user: { $arrayElemAt: ["$user", 0] } },
            in: {
              address: { $toString: "$_id" },
              userName: {
                $ifNull: [
                  { $toLower: "$$user.userName" },
                  {
                    $ifNull: [
                      "$$user.ensName",
                      {
                        $concat: [
                          { $substr: [{ $toString: "$_id" }, 0, 6] },
                          "...",
                          { $substr: [{ $toString: "$_id" }, -4, 4] },
                        ],
                      },
                    ],
                  },
                ],
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
      },
    },
    {
      $project: {
        _id: false,
        address: true,
        traits: true,
        heads: true,
        accessories: true,
        glasses: true,
        bodies: true,
        nouns: true,
        userInfo: true,
      },
    },
  ]);

  return await cursor.toArray() as UserStats[];
};
