import { TraitSchema } from "@/db/schema/TraitSchema";
import { database } from "@/utils/database/db";
import Session from "@/utils/siwe/session";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params: { traitId } }) {
  const session = await Session.fromRequest(req);

  if (!session.address) {
    return NextResponse.json({ error: "Not signed in" }, { status: 403 });
  }

  await database
    .collection<TraitSchema>("nfts")
    .updateOne(
      { _id: new ObjectId(traitId) },
      { $addToSet: { likedBy: session.address.toLowerCase() } }
    );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params: { traitId } }) {
  const session = await Session.fromRequest(req);

  if (!session.address) {
    return NextResponse.json({ error: "Not signed in" }, { status: 403 });
  }

  await database
    .collection<TraitSchema>("nfts")
    .updateOne(
      { _id: new ObjectId(traitId) },
      { $pull: { likedBy: session.address.toLowerCase() as `0x${string}` } }
    );

  return NextResponse.json({ success: true });
}
