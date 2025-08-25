"use server";

import { TraitSchema } from "@/db/schema/TraitSchema";
import { getDatabase } from "@/utils/database/db";
import { ObjectId } from "mongodb";

export const getNextVersion = async (traitId: string): Promise<number> => {
    const database = await getDatabase();
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
                _id: null,
                maxVersion: { $max: "$version" },
            },
        },
    ]);

    const result = await cursor.next();
    const maxVersion = result?.maxVersion || 0;

    return maxVersion + 1;
};