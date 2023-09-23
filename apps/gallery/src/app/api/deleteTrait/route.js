import { ObjectId } from "mongodb";
import { database } from "@/app/database/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  const formData = await req.formData();
  const nftId = formData.get("nftId");
  const traitId = formData.get("traitId");
  const address = formData.get("address");
  const type = formData.get("type");
  const likesCount = formData.get("likesCount");

  await database.collection("nfts").deleteOne({ _id: new ObjectId(nftId) });
  await database
    .collection("userTraits")
    .deleteOne({ _id: new ObjectId(traitId) });

  //   headCount: 8,
  //   accessoryCount: 2,
  //   glassesCount: 0,
  //   likesCount: 0,

  const user = await database.collection("users").findOne({ _id: address });
  if (type == "heads") {
    await database.collection("users").updateOne(
      { _id: address },
      {
        $set: {
          headCount: user.headCount - 1,
          likesCount: user.likesCount - likesCount,
        },
      }
    );
  }
  if (type == "accessories") {
    await database.collection("users").updateOne(
      { _id: address },
      {
        $set: {
          accessoryCount: user.accessoryCount - 1,
          likesCount: user.likesCount - likesCount,
        },
      }
    );
  }
  return NextResponse.json({ status: true });
}
