"use server";

import { TraitSchema } from "@/db/schema/TraitSchema";
import { Trait } from "@/types/trait";
import { database } from "@/utils/database/db";
import { ObjectId } from "mongodb";

export const getAllVersions = async (
  traitId: string,
  options?: { requester?: `0x${string}` }
): Promise<Trait[]> => {
  const cursor = database.collection<TraitSchema>("nfts").aggregate([
    {
      $match: {
        _id: new ObjectId(traitId),
      },
    },
    {
      $graphLookup: {
        from: "nfts",
        startWith: "$_id",
        connectFromField: "_id",
        connectToField: "remixedFrom",
        as: "descendants",
      },
    },
    {
      $graphLookup: {
        from: "nfts",
        startWith: "$remixedFrom",
        connectFromField: "remixedFrom",
        connectToField: "_id",
        as: "ancestors",
      },
    },
    {
      $project: {
        allVersions: {
          $concatArrays: [
            ["$$ROOT"],
            "$descendants",
            "$ancestors",
          ],
        },
      },
    },
    {
      $unwind: "$allVersions",
    },
    {
      $replaceRoot: {
        newRoot: "$allVersions",
      },
    },
    {
      $group: {
        _id: "$_id",
        doc: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: {
        newRoot: "$doc",
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
    {
      $project: {
        likedBy: 0,
        likers: 0,
        _id: false,
      },
    },
    {
      $sort: {
        creationDate: 1,
      },
    },
  ]);

  return (await cursor.toArray()) as Trait[];
};