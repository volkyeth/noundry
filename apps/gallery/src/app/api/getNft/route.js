import { database } from "@/utils/database/db";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const pipeline = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "address",
        foreignField: "_id",
        as: "user",
      },
    },
  ];

  const [data] = await database
    .collection("nfts")
    .aggregate(pipeline)
    .toArray();
  // const data = await database
  //   .collection("nfts")
  //   .findOne({ _id: new ObjectId(id) });
  const trait = await database
    .collection("userTraits")
    .findOne({ file: data.trait });
  data.traitId = trait._id;
  return NextResponse.json(data);
}
