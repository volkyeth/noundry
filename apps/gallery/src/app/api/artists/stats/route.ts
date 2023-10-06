import { NextResponse } from "next/server";

import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";

export async function GET(req) {
  const cursor = database.collection<TraitSchema>("nfts").aggregate([
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
        traits: { $sum: 1 },
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
      $unwind: "$user",
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", "$user"],
        },
      },
    },
    {
      $project: {
        traits: true,
        heads: true,
        accessories: true,
        glasses: true,
        bodies: true,
      },
    },
  ]);

  return NextResponse.json(await cursor.toArray());
}
