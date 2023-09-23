import { NextResponse } from "next/server";

import { database } from "@/app/database/db";
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
    return NextResponse.json(userData);
  }
}
