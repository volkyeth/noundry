import { TraitSchema } from "@/db/schema/TraitSchema";
import { Trait } from "@/types/trait";
import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params: { id } }) {
  const session = await Session.fromRequest(req);
  return NextResponse.json(await getTrait(id, session.address));
}

export const getTrait = async (id: string, requester?: `0x${string}`) => {
  const cursor = database.collection<TraitSchema>("nfts").aggregate(
    [
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
      ...(requester
        ? [
            {
              $addFields: {
                liked: { $in: [requester.toLowerCase(), "$likedBy"] },
              },
            },
          ]
        : []),
      { $project: { likedBy: 0, likers: 0, _id: false } },
    ],
    { collation: { locale: "en", strength: 2 } }
  );

  return (await cursor.next()) as Trait | null;
};
