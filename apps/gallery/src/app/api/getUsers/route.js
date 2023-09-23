import { NextResponse } from "next/server";

import { database } from "@/app/database/db";
export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const userData = await database
    .collection("users")
    .find()
    .sort({ _id: -1 })
    .skip(parseInt(page) * 12)
    .limit(12)
    .toArray();
  return NextResponse.json(userData);
}
