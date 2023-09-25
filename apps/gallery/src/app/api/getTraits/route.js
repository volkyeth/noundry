import { database } from "@/utils/database/db";
import { NextResponse } from "next/server";
export async function POST(req, res) {
  const [backgrounds, bodies, accessories, heads, glasses] = await Promise.all([
    database.collection("backgrounds").find({}).toArray(),
    database.collection("bodies").find({}).toArray(),
    database.collection("accessories").find({}).toArray(),
    database.collection("heads").find({}).toArray(),
    database.collection("glasses").find({}).toArray(),
  ]);

  return NextResponse.json({
    backgrounds: backgrounds.map((x) => x.name),
    bodies: bodies.map((x) => x.name),
    accessories: accessories.map((x) => x.name),
    heads: heads.map((x) => x.name),
    glasses: glasses.map((x) => x.name),
  });
}
