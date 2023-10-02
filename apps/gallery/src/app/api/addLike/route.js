import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  await Session.assertSiwe(req);

  const body = await req.json();

  const nft = await database.collection("nfts").findOne({ nft: body.nft });
  const user = await database.collection("users").findOne({ _id: nft.address });

  if (nft.address.toLowerCase() !== body.liker.toLowerCase()) {
    if (!nft.likedBy.includes(body.liker)) {
      nft.likesCount += 1;
      nft.likedBy.push(body.liker);
      user.likesCount += 1;
    } else {
      // User has already liked the NFT, remove their like
      nft.likesCount -= 1;
      nft.likedBy = nft.likedBy.filter((liker) => liker !== body.liker);
      user.likesCount -= 1;
    }

    // Update both the NFT and user documents in one go
    await database.collection("nfts").updateOne(
      { nft: body.nft },
      {
        $set: {
          likesCount: nft.likesCount,
          likedBy: nft.likedBy,
        },
      }
    );

    await database.collection("users").updateOne(
      { _id: nft.address },
      {
        $set: {
          likesCount: user.likesCount,
        },
      }
    );
  } else {
  }

  return NextResponse.json({ status: "success" });
}
