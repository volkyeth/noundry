import { NextResponse } from "next/server";

import { database } from "@/utils/database/db";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  const userData = await database.collection("users").findOne({ _id: address });
  if (userData == null) {
    const userObj = {
      _id: address,
      twitter: "",
      userName: "",
      headCount: 0,
      accessoryCount: 0,
      glassesCount: 0,
      likesCount: 0,
      about: "",
      nfts: [],
      likedNfts: [],
    };
    const ress = await database.collection("users").insertOne(userObj);
    return NextResponse.json(userObj);
  } else {
    const basepipeline = [
      {
        $match: {
          address: address,
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

    const nftsAggregation = await database
      .collection("nfts")
      .aggregate(basepipeline)
      .toArray();

    // const nfts = await database
    //   .collection("nfts")
    //   .find({ address: address })
    //   .toArray();
    userData.nfts = nftsAggregation;
    const pipeline = [
      {
        $match: {},
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

    const allNfts = await database
      .collection("nfts")
      .aggregate(pipeline)
      .toArray();

    //const allNfts = await database.collection("nfts").find({}).toArray();
    const likedNfts = allNfts.filter((nft) => nft.likedBy.includes(address));
    userData.likedNfts = likedNfts;

    return NextResponse.json(userData);
  }
}
