import { NextResponse } from "next/server";
import { database } from "@/app/database/db";
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
